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

  const imageUrl = Array.isArray(event.images) ? event.images[0] : event.images;
  const validImage = imageUrl && imageUrl.trim() !== "";

  return (
    <div className="post-card" onClick={handleClick}>
      {validImage ? (
        <img
          src={imageUrl}
          alt="Event"
          className="post-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400?text=Image+Not+Available";
          }}
        />
      ) : (
        <img
          src="https://placehold.co/600x400?text=Image+Not+Available"
          alt="No image available"
          className="post-image"
        />
      )}

      <h2 className="post-title">{event.title}</h2>

      <p className="post-status">
        Status: {event.status ? "Active" : "Closed"}
      </p>

      <p className="post-creator">
        Created by:{" "}
        <UserLink userId={event.user_id} username={username} onClose={onClose}>
          {username}
        </UserLink>
      </p>
    </div>
  );
}
