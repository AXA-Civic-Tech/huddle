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
 * Reusable component in both HomePage and UserPage
 * Displays on the left side and on top of the Map
 * Renders ALL posts && Post receive event as a prop
 * HomePage: Filter by All Posts, Status, Type, Borough, and different Neighborhoods based on Borough
 * HomePage: Sort by Most Recent and Most Upvotes
 *
 * UserPage: Sort by Upvote (Most Recent) && Title is "Upvote"
 *
 * STRETCH: Feed should display different Posts based on the area when zoomed in or out
 * @returns
 */

export default function Feed({
  onPostCountChange,
  filterType,
  filterValue,
  onFilterChange,
  onMapMove,
  openAuthOverlay,
  authOverlayOpen,
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

  // Fetch posts and apply upvote filtering if needed
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

  useEffect(() => {
    fetchPosts();
  }, [filterType, filterValue]);

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

  // Simplified logic here, all we need to do is fetch all posts again any time a post is updated/deleted
  const closeModal = async () => {
    // Always re-fetch posts after an update or delete
    fetchPosts();
    setSelectedPost(null);
    setIsOpen(false);
  };

  const handleNewPost = () => {
    setSelectedPost({});
    setIsOpen(true);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

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
      filtered = filtered.filter((post) => post.status === filterValue);
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
      filtered = filtered.filter(post =>
        post.title && post.title.toLowerCase().includes(eventSearchQuery.toLowerCase())
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
          onChange={e => setEventSearchQuery(e.target.value)}
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
        ) : (
          sorted
            .filter(Boolean)
            .map((post) => (
              <Post
                key={post.id}
                event={post}
                onSelect={openModal}
                onClose={closeModal}
              />
            ))
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
