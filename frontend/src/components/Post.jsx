import { useEffect, useState } from "react";
import { getUser } from "../adapters/user-adapter";
import UserLink from "./UserLink";

/**
 * Renders a clickable post card displaying summary information
 * about an event or issue, including title, status, creator, and image.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.event - The event/issue object containing data to display
 * @param {Function} props.onSelect - Callback triggered when the post is clicked
 * @param {Function} [props.onClose] - Optional callback used to close a modal or overlay
 * @returns {JSX.Element} The rendered post card component
 */

export default function Post({ event, onSelect, onClose }) {
  const [username, setUsername] = useState("Loading...");

  /**
   * Fetch the username of the event's creator using the user ID.
   * Sets fallback text if fetch fails or user is not found.
   */
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

  /**
   * Handles clicking on the post card.
   * Triggers the onSelect callback with the event data.
   */
  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  // Determine the image URL and fallback logic
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
