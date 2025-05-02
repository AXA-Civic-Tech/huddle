import { useContext, useState } from "react";
import CurrentUserContext from "../contexts/current-user-context";

/**
 * After the Post is clicked on from the Feed, the Modal will pop up in front of the Map
 * Modal will take event as a prop
 * This component is a reusable component:
 * creating a new issue
 * rendering existing issue
 * giving the option for owner of the post to edit.
 * @returns
 */

export default function Modal({ event = {}, onClose }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const isNew = !event?.event_id;
  const isEditableByUser = isNew || currentUser?.id === event.user_id;

  const [edit, setEdit] = useState(null);
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
      const response = await fetch(url, {
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
      setEdit(null);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const render = (label, value, setValue, name, type = "text") => {
    const isEdit = edit === name;

    return (
      <div className="field">
        <label className={name}>{label}:</label>
        {isEdit ? (
          <>
            {type === "textarea" ? (
              <textarea
                className="edit-control"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <input
                className="edit-control"
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
            <button onClick={() => setEdit(null)}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p className={name}>{value}</p>
            {isEditableByUser && (
              <button onClick={() => setEdit(name)}>Edit</button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="modal" key={event.event_id}>
      {event.image && (
        <img src={event.image.src} alt={event.image.alt} className="image" />
      )}

      {render("Title", title, setTitle, "title")}

      {render("Address", address, setAddress, "address")}

      <label>Status:</label>
      {isEditableByUser && edit === "status" ? (
        <>
          <select onChange={(e) => setStatus(e.target.value)} value={status}>
            <option value="open">Open</option>
            <option value="progress">In Progress...</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={() => setEdit(null)}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <label>Status: {status}</label>
      )}

      {render("Email", email, setEmail, "email")}

      {render("Phone", phone, setPhone, "phone")}

      {render(
        "Description",
        description,
        setDescription,
        "description",
        "textarea"
      )}

      <div className="comments">
        {event.comments?.map((comment, index) => (
          <p key={index}>
            <strong>{event.username}</strong>: {comment}
          </p>
        ))}
      </div>
    </div>
  );
}
