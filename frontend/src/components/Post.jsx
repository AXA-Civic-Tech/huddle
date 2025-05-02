import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";

/**
 * This component is for rendering limited amount of data for the Feed
 * With the eventId as a prop, we will extract the data and implement that for each HTML element
 * I'm not sure how we are going to implement the status from the event so status will make do for now.
 * Needs an event listener on the Post card so the Modal can pop up
 * @returns
 */

export default function Post({ event }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  return (
    <div className="post">
      <img src={event.image.src} alt={event.image.alt} />

      <h2>Ti</h2>

      <label>Status:</label>
      {!currentUser ? (
        status
      ) : (
        <select>
          <option>Open</option>
          <option>In Progress...</option>
          <option>Closed</option>
        </select>
      )}

      <div className="comments"></div>
    </div>
  );
}
