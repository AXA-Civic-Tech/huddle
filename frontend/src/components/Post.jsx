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

export default function Post({ event, onSelect }) {
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
  }, [event.user_id]);

  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  return (
    <div className="post" onClick={handleClick}>
      {/* <img src={event.image.src} alt={event.image.alt} /> */}

      <h2 className="title">{event.title}</h2>

      <p className="status">Status: {event.status}</p>

      <p>
        Created by:{" "}
        <UserLink userId={event.user_id} username={username || "User"}>
          {username || "User"}
        </UserLink>
      </p>

      <Button name="View More" onClick={handleClick} />

      {/* <div className="comments">{event.comments}</div> */}
    </div>
  );
}
