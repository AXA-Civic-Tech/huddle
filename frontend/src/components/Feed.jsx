import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../adapters/post-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import Post from "./Post";
import Modal from "./Modal";
import Button from "./Button";

/**
 * Reusable component in both HomePage and UserPage
 * @params userId (if exist)
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
 * UserPage: Sort by Favorites (Most Recent) && Title is "Favorites"
 *
 * STRETCH: Feed should display different Posts based on the area when zoomed in or out
 * @returns
 */

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Community Posts");
  const [filterValue, setFilterValue] = useState("");
  const { currentUser } = useContext(CurrentUserContext);

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
    const titleMap = {
      recent: "Community Posts",
      city: filterValue ? `${filterValue}` : "Posts by City",
      borough: filterValue ? `${filterValue}` : "Posts by Borough",
      open: "Open Issues & Events",
      progress: "In Progress Issues & Events",
      closed: "Closed Issues & Events",
      issue: "Issues",
      urgent: "Most Urgent Issues",
      event: "Events",
      upvote: "Your Upvoted Posts",
    };

    setTitle(titleMap[sort] || "Community Posts");
  }, [sort, filterValue]);

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

  const handleSort = (e) => {
    setSort(e.target.value);
    setFilterValue("");
  };

  const getFilteredAndSortedPosts = () => {
    const sortByRecent = (a, b) =>
      new Date(b.date_created || 0) - new Date(a.date_created || 0);

    const sortByUrgent = (a, b) =>
      (b.upvotes?.length || 0) - (a.upvotes?.length || 0);

    const sortByCity = (a, b) => {
      const cityCompare = (a.city || "").localeCompare(b.city || "");
      return cityCompare !== 0 ? cityCompare : sortByRecent(a, b);
    };

    const sortByBorough = (a, b) => {
      const boroughCompare = (a.borough || "").localeCompare(b.borough || "");
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortFuncs = {
      recent: sortByRecent,
      urgent: sortByUrgent,
      city: sortByCity,
      borough: sortByBorough,
      open: sortByRecent,
      progress: sortByRecent,
      closed: sortByRecent,
      issue: sortByRecent,
      event: sortByRecent,
      upvote: sortByRecent,
    };
    // Apply filters
    let filtered = [...posts];

    switch (sort) {
      case "open":
        filtered = filtered.filter((post) => post.status === "open");
        break;
      case "progress":
        filtered = filtered.filter((post) => post.status === "progress");
        break;
      case "closed":
        filtered = filtered.filter((post) => post.status === "closed");
        break;
      case "issue":
        filtered = filtered.filter((post) => post.is_issue);
        break;
      case "event":
        filtered = filtered.filter((post) => !post.is_issue);
        break;
      case "upvote":
        if (currentUser) {
          filtered = filtered.filter(
            (post) =>
              post.upvotes &&
              Array.isArray(post.upvotes) &&
              post.upvotes.includes(currentUser.id)
          );
        }
        break;
      case "city":
        if (filterValue) {
          filtered = filtered.filter((post) => post.city === filterValue);
        }
        break;
      case "borough":
        if (filterValue) {
          filtered = filtered.filter((post) => post.borough === filterValue);
        }
        break;
    }

    const sortFunction = sortFuncs[sort] || sortFuncs.recent;
    return filtered.sort(sortFunction);
  };

  const sorted = getFilteredAndSortedPosts();

  return (
    <div className="feed">
      <h1>{title}</h1>

      <div className="feed-controls">
        <select className="sort" value={sort} onChange={handleSort}>
          <option value="default">Most Recent</option>
          <option value="city">By City</option>
          <option value="borough">By Borough</option>
          <option value="open">Status: Open</option>
          <option value="progress">Status: In Progress...</option>
          <option value="closed">Status: Closed</option>
          <option value="issue">Issues</option>
          <option value="urgent">Most Urgent Issues</option>
          <option value="event">Events</option>
          {currentUser && <option value="upvote">Upvotes</option>}
        </select>

        {currentUser && (
          // Thinking if we should make an icon to be our Create New Post or Report New Issue button
          <Button name="Create New Post" onClick={handleNewPost} />
        )}
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet! Be the first to create one.</p>
      ) : (
        sortedPosts
          .filter(Boolean)
          .map((post) => (
            <Post key={post.id} event={post} onSelect={openModal} />
          ))
      )}

      <Modal event={selectedPost || {}} onClose={closeModal} isOpen={isOpen} />
    </div>
  );
}
