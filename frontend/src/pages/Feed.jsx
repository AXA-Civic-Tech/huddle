import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../adapters/post-adapter";
import Post from "../components/Post";
import Modal from "../components/Modal";
import CurrentUserContext from "../contexts/current-user-context";

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

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true);
      getAllPosts().then(([data, error]) => {
        if (data) setPosts(data);
        else console.error(error);
      });
    };

    fetchPosts();
  }, []);

  const openModal = (event) => {
    setSelectedPost(event);
    setIsOpen(true);
  };

  const closeModal = (event) => {
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

  return (
    <div className="feed">
      <h1>All Posts</h1>

      <select className="sort">
        <option value="city">City</option>
        <option value="borough">Borough</option>
        <option value="recent">Most Urgent</option>
        <option value="status">Status</option>
      </select>

      {posts.length === 0 ? (
        <p>No posts yet!</p>
      ) : (
        posts
          .filter(Boolean)
          .map((post) => (
            <Post key={post.id} event={post} onSelect={openModal} />
          ))
      )}
      {selectedPost && (
        <Modal event={selectedPost} onClose={closeModal} isOpen={isOpen} />
      )}
    </div>
  );
}
