import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import Edit from "./Edit";

/**
 * After the Post is clicked on from the Feed, the Modal will pop up in front of the Map
 * I think Modal should take eventId as a prop
 * @returns
 */

export default function Modal({ eventId }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  return (
    <div className="modal" key={eventId}>
      <img src="" alt="" />

      <h2>{eventId.title}</h2>
      {currentUser && <Edit />}

      <p>Address: {eventId.address}</p>
      {currentUser && <Edit />}

      {!currentUser ? (
        <label>Status: {eventId.status}</label>
      ) : (
        <>
          <label>Status:</label>
          <select>
            <option>Open</option>
            <option>In Progress...</option>
            <option>Closed</option>
          </select>
        </>
      )}

      <p>Email: {eventId.email}</p>
      {currentUser && <Edit />}

      <p>Phone: {eventId.phone}</p>
      {currentUser && <Edit />}

      <p>Description: {eventId.description}</p>
      {currentUser && <Edit />}

      <div className="comments"></div>
    </div>
  );
}
