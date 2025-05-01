import { useContext, useState } from "react";
import CurrentUserContext from "../contexts/current-user-context";

/**
 * After the Post is clicked on from the Feed, the Modal will pop up in front of the Map
 * I think Modal should take event as a prop
 * @returns
 */

export default function Modal({ event = {}, onClose }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const isNew = !event?.event_id;
  const isEdit = isNew || currentUser?.id === event.user_id;

  const [title, setTitle] = useState(event.title || "");
  const [address, setAddress] = useState(event.address || "");
  const [status, setStatus] = useState(event.status || "open");
  const [email, setEmail] = useState(event.email || "");
  const [phone, setPhone] = useState(event.phone || "");
  const [description, setDescription] = useState(event.description || "");

  const handleSave = async () => {
    const method = isNew ? "POST" : "PATCH";
    const url = isNew ? "/api/events" : `/api/events/${event.event_id}`;

    try {
      const response = await fetch(`/api/events/${event.event_id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          address,
          status,
          email,
          phone,
          description,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal" key={event.event_id}>
      <img src={event.image.src} alt={event.image.alt} className="image" />

      {currentUser ? (
        <>
          {isEdit ? (
            <input
              type="text"
              className="edit-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h2 className="title">{title}</h2>
          )}
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && <button onClick={handleSave}>Save</button>}
        </>
      ) : (
        <h2 className="title">{title}</h2>
      )}

      {currentUser ? (
        <>
          {isEdit ? (
            <input
              type="text"
              className="edit-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <p className="address">Address: {address}</p>
          )}
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && <button onClick={handleSave}>Save</button>}
        </>
      ) : (
        <p className="address">Address: {address}</p>
      )}

      {currentUser ? (
        <>
          <label>Status:</label>
          <select
            onChange={(e) => setStatus(e.target.value)}
            defaultValue={status}
          >
            <option value="open">Open</option>
            <option value="progress">In Progress...</option>
            <option value="closed">Closed</option>
          </select>
        </>
      ) : (
        <label>Status: {status}</label>
      )}

      {currentUser ? (
        <>
          {isEdit ? (
            <input
              type="text"
              className="edit-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className="email">Email: {email}</p>
          )}
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && <button onClick={handleSave}>Save</button>}
        </>
      ) : (
        <p className="email">Email: {email}</p>
      )}

      {currentUser ? (
        <>
          {isEdit ? (
            <input
              type="text"
              className="edit-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <p className="phone">Phone: {phone}</p>
          )}
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && <button onClick={handleSave}>Save</button>}
        </>
      ) : (
        <p className="phone">Phone: {phone}</p>
      )}

      {currentUser ? (
        <>
          {isEdit ? (
            <input
              type="text"
              className="edit-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <p className="description">Description: {description}</p>
          )}
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && <button onClick={handleSave}>Save</button>}
        </>
      ) : (
        <p className="description">Description: {description}</p>
      )}

      <div className="comments">
        {event.comments.map((comment) => {
          return (
            <p>
              {event.username} {comment}
            </p>
          );
        })}
      </div>
    </div>
  );
}
