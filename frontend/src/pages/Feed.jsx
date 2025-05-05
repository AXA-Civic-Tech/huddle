import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../adapters/post-adapter";
import Post from "../components/Post";
import Modal from "../components/Modal";
import CurrentUserContext from "../contexts/current-user-context";
import Button from "../components/Button";

/**
 * Feed should display different Posts based on the area when zoomed in or out
 * Each post will receive event as a prop
 * Feed will show up on the side bar on top of the Map
 * Feed should have filtered Posts by city (most recent), borough (most recent), most recent Posts, and probably based on status
 * @returns
 */

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(CurrentUserContext);

  const fetchPosts = () => {
    setLoading(true);
    getAllPosts().then(([data, error]) => {
      if (data) setPosts(data);
      else console.error(error);
    });
  };

  useEffect(() => {
    fetchPosts();
    setLoading(false);
  }, []);

  const openModal = (event) => {
    setSelectedPost(event);
    setIsOpen(true);
  };

  const closeModal = (updatedPost) => {
    // If we received updated data, update our post list
    if (updatedPost && updatedPost.id) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
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
  };

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sort) {
      case "city":
        return (a.city || "").localeCompare(b.city || "");
      case "borough":
        return (a.borough || "").localeCompare(b.borough || "");
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      case "urgent":
      // This will determined based on upvotes
      default:
        return new Date(b.date_created || 0) - new Date(a.date_created || 0);
    }
  });

  return (
    <div className="feed">
      <h1>Community Posts</h1>

      <div className="feed-controls">
        <select className="sort" value={sort} onChange={handleSort}>
          <option value="recent">Most Recent</option>
          <option value="city">By City</option>
          <option value="borough">By Borough</option>
          <option value="urgent">Most Urgent</option>
          <option value="status">By Status</option>
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
