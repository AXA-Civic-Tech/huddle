import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllPosts } from "../adapters/post-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import Post from "./Post";
import Modal from "./Modal";
import Button from "./Button";

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
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Community Posts");
  const [filterValue, setFilterValue] = useState("");
  const { currentUser } = useContext(CurrentUserContext);

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
    const titleMap = {
      recent: "Community Posts",
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

    const sortByManhattan = (a, b) => {
      const boroughCompare = (a.borough === "manhattan" || "").localeCompare(
        b.borough === "manhattan" || ""
      );
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortByBrooklyn = (a, b) => {
      const boroughCompare = (a.borough === "brooklyn" || "").localeCompare(
        b.borough === "brooklyn" || ""
      );
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortByQueens = (a, b) => {
      const boroughCompare = (a.borough === "queens" || "").localeCompare(
        b.borough === "queens" || ""
      );
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortByBronx = (a, b) => {
      const boroughCompare = (a.borough === "bronx" || "").localeCompare(
        b.borough === "bronx" || ""
      );
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortByStatenIsland = (a, b) => {
      const boroughCompare = (a.borough === "statenIsland" || "").localeCompare(
        b.borough === "statenIsland" || ""
      );
      return boroughCompare !== 0 ? boroughCompare : sortByRecent(a, b);
    };

    const sortFuncs = {
      recent: sortByRecent,
      urgent: sortByUrgent,
      manhattan: sortByManhattan,
      brooklyn: sortByBrooklyn,
      queens: sortByQueens,
      bronx: sortByBronx,
      statenIsland: sortByStatenIsland,
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
        if (currentUser && pathname === `/users/${currentUser.id}`) {
          filtered = filtered.filter(
            (post) =>
              post.upvotes &&
              Array.isArray(post.upvotes) &&
              post.upvotes.includes(currentUser.id)
          );
        }
        break;
      case "manhattan":
        if (filterValue) {
          filtered = filtered.filter((post) => post.borough === filterValue);
        }
        break;
      case "brooklyn":
        if (filterValue) {
          filtered = filtered.filter((post) => post.borough === filterValue);
        }
        break;
      case "queens":
        if (filterValue) {
          filtered = filtered.filter((post) => post.borough === filterValue);
        }
        break;
      case "bronx":
        if (filterValue) {
          filtered = filtered.filter((post) => post.borough === filterValue);
        }
        break;
      case "statenIsland":
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
        <select className="filter" value={sort} onChange={handleSort}>
          <option value="open">Status: Open</option>
          <option value="progress">Status: In Progress...</option>
          <option value="closed">Status: Closed</option>
          <option value="issue">Issues</option>
          <option value="urgent">Most Urgent Issues</option>
          <option value="event">Events</option>
          {currentUser && pathname === `/users/${currentUser.id}` && (
            <option value="upvote">Upvotes</option>
          )}
        </select>

        <select className="sort" value={filter} onChange={handleFilter}>
          <option value="recent">Most Recent</option>
          <option value="urgent">Most Urgent Issues</option>
          <option value="manhattan">Manhattan</option>
          <option value="queens">Queens</option>
          <option value="brooklyn">Brooklyn</option>
          <option value="bronx">The Bronx</option>
          <option value="statenIsland">Staten Island</option>
          <option value="neighborhood">By {neighborhood}</option>
        </select>

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
