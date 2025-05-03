import { useEffect, useState } from "react";
import { getAllPosts } from "../adapters/post-adapter";

/**
 * Need the length of all the posts' in the database
 * Each post needs event_id as a prop
 * From there, we can retrieve all of the data from each event_id to render
 * @returns
 */

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then(([data, error]) => {
      if (data) setPosts(data)
      else console.error(error)
    });
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      
      {posts.length === 0 ? (
        <p>No posts yet!</p>
      ) : (
        posts.filter(Boolean).map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
