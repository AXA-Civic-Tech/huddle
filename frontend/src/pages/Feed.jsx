import { useEffect, useState } from "react";
import { getAllPosts } from "../adapters/post-adapter";
import Post from "../components/Post";

/**
 * Feed should display different Posts based on the area when zoomed in or out
 * Each post will receive event as a prop
 * Feed will show up on the side bar on top of the Map
 * Feed should have filtered Posts by city (most recent), borough (most recent), most recent Posts, and probably based on status
 * @returns
 */

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

  
    useEffect(() => {
      getAllPosts().then(([data, error]) => {
        if (data) setPosts(data)
        else console.error(error)
      });
    }, []);
  
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
          posts.filter(Boolean).map(post => (
            <Post
            key={post.id}
            event={post}
            onSelect={setSelectedEvent}
          />
          ))
        )}
        {selectedEvent && (
          <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    );
