import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllPosts } from "../adapters/post-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import { getNeighborhoodFromZip } from "../utils/neighborhoods";
import Post from "./Post";
import Modal from "./Modal";
import FeedControls from "./FeedControls";

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

export default function Feed() {
  const location = useLocation();
  const pathname = location.pathname;
  const { id: urlUserId } = useParams();

  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Community Posts");
  const { currentUser } = useContext(CurrentUserContext);

  const [sort, setSort] = useState("recent");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  // Check if current user is viewing another user's profile
  const isViewing =
    currentUser && urlUserId && currentUser.id !== parseInt(urlUserId);

  const fetchPosts = () => {
    setLoading(true);
    getAllPosts().then(([data, error]) => {
      if (data) setPosts(data);
      else console.error(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
  };

  const closeModal = async (updatedPost) => {
    // If we received updated data, update our post list
    if (updatedPost) {
      console.log("Received updated/new post:", updatedPost);

      // Handle both new posts and updated posts
      if (updatedPost.id) {
        setPosts((prevPosts) => {
          // Check if this post already exists in our list
          const postExists = prevPosts.some(
            (post) => post.id === updatedPost.id
          );

          if (postExists) {
            // Update exisitng post
            return prevPosts.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
            );
          } else {
            // Add new post to the list
            return [updatedPost, ...prevPosts];
          }
        });
      }
    }

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

  const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value.includes(":")) {
      const [type, val] = value.split(":");
      setFilterType(type);
      setFilterValue(val);
    } else {
      setFilterType("all");
      setFilterValue("");
    }
  };

  const getFilteredAndSortedPosts = () => {
    // First apply filters
    let filtered = [...posts];

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
    } else if (
      filterType === "upvote" &&
      currentUser &&
      pathname === `/users/${currentUser.id}`
    ) {
      filtered = filtered.filter(
        (post) =>
          post.upvotes &&
          Array.isArray(post.upvotes) &&
          post.upvotes.includes(currentUser.id)
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
    <div className="feed">
      <h1>{title}</h1>

      <FeedControls
        filterType={filterType}
        filterValue={filterValue}
        sort={sort}
        onFilterChange={handleFilterChange}
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
      ) : (
        sorted
          .filter(Boolean)
          .map((post) => (
            <Post key={post.id} event={post} onSelect={openModal} />
          ))
      )}

      <Modal
        event={selectedPost || {}}
        onClose={closeModal}
        isOpen={isOpen}
        viewing={isViewing}
      />
    </div>
  );
}
