import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllPosts } from "../adapters/post-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import Post from "./Post";
import Modal from "./Modal";
import Button from "./Button";
import {
  getNeighborhoodFromZip,
  neighborhoodsByBorough,
} from "../utils/neighborhoods";

/**
 * Reusable component in both HomePage and UserPage
 * Displays on the left side and on top of the Map
 * Renders ALL posts && Post receive event as a prop
 * HomePage: Sort by Most Recent (Default) && Title is "Community Posts"
 * HomePage: Sort by City (Most Recent) && Title will change based on City
 * HomePage: Sort by Borough (Most Recent) && Title will change based on Borough
 * HomePage: Sort by Status: Open (Most Recent) && Title will change based on Status
 * HomePage: Sort by Status: In Progress... (Most Recent) && Title will change based on Status
 * HomePage: Sort by Status: Closed (Most Recent) && Title will change based on Status
 * HomePage: Sort by Issues (Most Recent) && Title is "Issues"
 * HomePage: Sort by Most Urgent Issues (Most Urgent/Upvotes) && Title is "Most Urgent Issues"
 * HomePage: Sort by Events (Most Recent) && Title is "Events"
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
      if (filterValue === "open") newTitle = "Open Issues & Events";
      else if (filterValue === "progress")
        newTitle = "In Progress Issues & Events";
      else if (filterValue === "closed") newTitle = "Closed Issues & Events";
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
      const [type, value] = value.split(":");
      setFilterType(type);
      setFilterValue(value);
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
        filtered == filtered.filter((post) => post.is_issue);
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

      <div className="feed-controls">
        {/* Filter Dropdown */}
        <div className="filter-section">
          <label htmlFor="filter-select">Filter: </label>
          <select
            id="filter-select"
            value={`${filterType}:${filterValue}`}
            onChange={handleFilterChange}
          >
            <option value="all:">All Posts</option>
            <optgroup label="Status">
              <option value="status:open">Open</option>
              <option value="status:progress">In Progress</option>
              <option value="status:closed">Closed</option>
            </optgroup>
            <optgroup label="Type">
              <option value="type:issue">Issues</option>
              <option value="type:event">Events</option>
            </optgroup>
            <optgroup label="Borough/Neighborhood">
              <optgroup label="Manhattan" value="borough:manhattan">
                {neighborhoodsByBorough[Manhattan].forEach((neighborhood) => (
                  <option value={`neighborhood:${neighborhood}`}>
                    {neighborhood}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Brooklyn" value="borough:brooklyn">
                {neighborhoodsByBorough[Brooklyn].forEach((neighborhood) => (
                  <option value={`neighborhood:${neighborhood}`}>
                    {neighborhood}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Queens" value="borough:queens">
                {neighborhoodsByBorough[Queens].forEach((neighborhood) => (
                  <option value={`neighborhood:${neighborhood}`}>
                    {neighborhood}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Bronx" value="borough:bronx">
                {neighborhoodsByBorough[Bronx].forEach((neighborhood) => (
                  <option value={`neighborhood:${neighborhood}`}>
                    {neighborhood}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Staten Island" value="borough:statenIsland">
                {neighborhoodsByBorough["Staten Island"].forEach(
                  (neighborhood) => (
                    <option value={`neighborhood:${neighborhood}`}>
                      {neighborhood}
                    </option>
                  )
                )}
              </optgroup>
            </optgroup>
            {currentUser && pathname === `/users/${currentUser.id}` && (
              <option value="upvote:true">My Upvoted Posts</option>
            )}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-section">
          <label htmlFor="sort-select">Sort By: </label>
          <select id="sort-select" value={sort} onChange={handleSortChange}>
            <option value="recent">Most Recent</option>
            <option value="urgent">Most Upvotes</option>
          </select>
        </div>

        {currentUser && !isViewing && (
          // Only show this button when not vewing another user's profile
          <Button name="Create New Post" onClick={handleNewPost} />
        )}
      </div>

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
