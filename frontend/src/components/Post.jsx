import { useEffect, useState } from "react";
import { getUser } from "../adapters/user-adapter";
import Button from "./Button";
import UserLink from "./UserLink";

/**
 * @params event, onSelect
 * Renders exisitng issues/events on Feed
 *
 * Styling: Hover Effect for indication that it's clickable
 * @returns
 */

export default function Post({ event, onSelect, onClose }) {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    // Fetch username when component shows or event.user_id changes
    const fetchUsername = async () => {
      const [userData, error] = await getUser(event.user_id);

      if (error || !userData) {
        console.error("Error fetching username:", error);
        setUsername("Unknown User");
        return;
      }

      setUsername(userData.username);
    };

    fetchUsername();
  }, [event?.user_id]);

  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  return (
    <div className="post-card" onClick={handleClick}>
      {event.images ? (
        <img 
          src={Array.isArray(event.images) ? event.images[0] : event.images} 
          alt="Event" 
          className="post-image" 
        />
      ) : (
        <p className="no-image">No image available</p>
      )}

      <h2 className="post-title">{event.title}</h2>

      <p className="post-status">Status: {event.status}</p>

      <p className="post-creator">
        Created by:{" "}
        <UserLink userId={event.user_id} username={username} onClose={onClose}>
          {username}
        </UserLink>
      </p>
    </div>
  );
}
