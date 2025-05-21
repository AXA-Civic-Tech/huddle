import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllPosts } from "../adapters/post-adapter";
import { getUpvotesByUser } from "../adapters/upvote-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import { getNeighborhoodFromZip } from "../utils/neighborhoods";
import Post from "./Post";
import Modal from "./Modal";
import FeedControls from "./Feed_children/FeedControls";
import EventSearchBar from "./EventSearchBar";

/**
 * Feed component displays a list of community posts.
 *
 * Reusable in both HomePage and UserPage.
 * - Filters posts by status, type, borough, neighborhood, and upvotes.
 * - Allows sorting by most recent and most urgent.
 * - Displays a modal for post interaction.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onPostCountChange - Callback to update the number of posts shown in user profile.
 * @param {string} props.filterType - Type of filter applied (e.g., 'status', 'type', 'borough').
 * @param {string} props.filterValue - The value for the selected filter type.
 * @param {Function} props.onFilterChange - Handler for updating filter values.
 * @param {Function} props.onMapMove - Callback for centering the map on post modal open.
 * @param {Function} props.openAuthOverlay - Callback to open the authentication modal.
 * @param {boolean} props.authOverlayOpen - Whether the auth modal is currently open.
 * @param {Function} props.onPostUpdate - Callback after a post is updated.
 *
 * @returns {JSX.Element} Rendered feed of posts.
 */

export default function Feed({
  onPostCountChange,
  filterType,
  filterValue,
  onFilterChange,
  onMapMove,
  openAuthOverlay,
  authOverlayOpen,
  onPostUpdate,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const { id: urlUserId } = useParams(); // string

  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Community Posts");
  const { currentUser } = useContext(CurrentUserContext);

  const [sort, setSort] = useState("recent");
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  // Check if current user is viewing another user's profile
  const isViewing =
    currentUser && urlUserId && currentUser.id !== parseInt(urlUserId);

  /**
   * Fetches all posts and filters them based on upvotes (if viewing user page).
   * Also sets post count when on a user profile.
   */
  const fetchPosts = async () => {
    setLoading(true);

    // 1. Fetch all posts
    const [data, error] = await getAllPosts();

    // If filtering by upvotes (on user profile page), fetch upvotes and filter posts
    if (
      filterType === "upvote" &&
      currentUser &&
      urlUserId &&
      currentUser.id === parseInt(urlUserId)
    ) {
      // Get all upvotes for the current user
      const upvotes = await getUpvotesByUser(currentUser.id);
      // Extract event IDs that the user has upvoted
      const upvotedEventIds = upvotes.map((u) => Number(u.event_id));
      // Filter posts to only those the user has upvoted
      const filteredPosts = data.filter((post) =>
        upvotedEventIds.includes(Number(post.id))
      );
      setPosts(filteredPosts);
    } else if (data) {
      setPosts(data);
      // If we're on a user profile page and the callback exists, send the post count
      if (pathname.startsWith("/users/") && onPostCountChange) {
        const userPosts = data.filter(
          (post) => post.user_id === parseInt(urlUserId)
        );
        onPostCountChange(userPosts.length);
      }
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  /**
   * useEffect to fetch posts whenever the filter type or value changes.
   * Triggers post reload and re-applies upvote logic if needed.
   */
  useEffect(() => {
    fetchPosts();
  }, [filterType, filterValue]);

  /**
   * useEffect to update the feed title whenever sort or filter criteria change.
   * Changes based on combinations of filterType and filterValue.
   */
  useEffect(() => {
    let newTitle = "Community Posts";

    if (filterType === "status") {
      if (filterValue === "Active") newTitle = "Active Issues & Events";
      else if (filterValue === "Closed") newTitle = "Closed Issues & Events";
    } else if (filterType === "type") {
      if (filterValue === "issue") newTitle = "Issues";
      else if (filterValue === "event") newTitle = "Events";
    } else if (filterType === "borough") {
      if (filterValue) newTitle = `${filterValue}`;
    } else if (filterType === "neighborhood") {
      if (filterValue) newTitle = `${filterValue}`;
    } else if (filterType === "upvote") {
      newTitle = "Your Upvoted Posts";
    }

    if (sort === "urgent" && filterType === "all") {
      newTitle = "Most Urgent Issues";
    }

    setTitle(newTitle);
  }, [sort, filterType, filterValue]);

  /**
   * Opens the modal with selected post details and moves the map to the post's location.
   * @param {Object} event - The selected post object.
   */
  const openModal = (event) => {
    setSelectedPost(event);
    setIsOpen(true);
    if (onMapMove && event.lat_location && event.long_location) {
      onMapMove(
        {
          lat: parseFloat(event.lat_location),
          lng: parseFloat(event.long_location),
        },
        17
      );
    }
  };

  /**
   * Closes the post modal and refreshes the posts.
   * Also triggers the onPostUpdate callback if provided.
   */
  const closeModal = async () => {
    // Always re-fetch posts after an update or delete
    fetchPosts();
    if (onPostUpdate) onPostUpdate(); // Call onPostUpdate when posts are updated
    setSelectedPost(null);
    setIsOpen(false);
  };

  /**
   * Opens the modal to create a new post.
   */
  const handleNewPost = () => {
    setSelectedPost({});
    setIsOpen(true);
  };

  /**
   * Handles change in sorting method.
   * @param {Event} e - The change event from the dropdown.
   */
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  /**
   * Applies filtering and sorting logic to the post list.
   * Filters by user, status, type, borough, neighborhood, and search query.
   * Sorts by most recent or most upvoted (urgent).
   *
   * @returns {Array} List of filtered and sorted post objects.
   */
  const getFilteredAndSortedPosts = () => {
    // First apply filters
    let filtered = [...posts];

    if (
      pathname === `/users/${urlUserId}` &&
      (filterType === "all" || !filterType)
    ) {
      filtered = filtered.filter(
        (post) => post.user_id === parseInt(urlUserId)
      );
    }

    // Apply filters based on filterType and filterValue
    if (filterType === "status") {
      if (filterValue === "Active") {
        filtered = filtered.filter((post) => post.status === true);
      } else if (filterValue === "Closed") {
        filtered = filtered.filter((post) => post.status === false);
      }
    } else if (filterType === "type") {
      if (filterValue === "issue") {
        filtered = filtered.filter((post) => post.is_issue);
      } else if (filterValue === "event") {
        filtered = filtered.filter((post) => !post.is_issue);
      }
    } else if (filterType === "borough") {
      filtered = filtered.filter(
        (post) => post.borough?.toLowerCase() === filterValue.toLowerCase()
      );
    } else if (filterType === "neighborhood") {
      filtered = filtered.filter(
        (post) => getNeighborhoodFromZip(post.zipcode) === filterValue
      );
    }

    // Apply event search query filter (case-insensitive)
    if (eventSearchQuery.trim() !== "") {
      filtered = filtered.filter(
        (post) =>
          post.title &&
          post.title.toLowerCase().includes(eventSearchQuery.toLowerCase())
      );
    }

    // Then sort the filtered posts
    if (sort === "recent") {
      return filtered.sort(
        (a, b) => new Date(b.date_created || 0) - new Date(a.date_created || 0)
      );
    } else if (sort === "urgent") {
      return filtered.sort(
        (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
      );
    }

    return filtered;
  };

  const sorted = getFilteredAndSortedPosts();

  return (
    <div className={pathname === "/" ? "feed-home" : "feed-user"}>
      <div className="feed-content">
        <h1>{title}</h1>

        <EventSearchBar
          value={eventSearchQuery}
          onChange={(e) => setEventSearchQuery(e.target.value)}
          placeholder="Search community posts..."
        />

        <FeedControls
          filterType={filterType}
          filterValue={filterValue}
          sort={sort}
          onFilterChange={onFilterChange}
          onSortChange={handleSortChange}
          onNewPost={handleNewPost}
          currentUser={currentUser}
          isViewing={isViewing}
          pathname={pathname}
        />

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet! Be the first to create one.</p>
        ) : pathname.startsWith("/users/") ? (
          <div className="posts-scroll-container">
            <div className="userpage-posts-grid">
              {sorted.filter(Boolean).map((post) => (
                <Post
                  key={post.id}
                  event={post}
                  onSelect={openModal}
                  onClose={closeModal}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="posts-scroll-container">
            {sorted.filter(Boolean).map((post) => (
              <Post
                key={post.id}
                event={post}
                onSelect={openModal}
                onClose={closeModal}
              />
            ))}
          </div>
        )}

        <Modal
          event={selectedPost || {}}
          onClose={closeModal}
          isOpen={isOpen}
          viewing={isViewing}
          openAuthOverlay={openAuthOverlay}
          authOverlayOpen={authOverlayOpen}
        />
      </div>
    </div>
  );
}
