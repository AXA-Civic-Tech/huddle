import { useContext, useState, useEffect, useRef } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import Button from "./Button";

/**
 * After the Post is clicked on from the Feed, the Modal will pop up in front of the Map
 * Modal will take event as a prop
 * This component is a reusable component:
 * creating a new issue
 * rendering existing issue
 * giving the option for owner of the post to edit.
 * @returns
 */

export default function Modal({ event = {}, comments = {}, isOpen, onClose }) {
  const dialogRef = useRef();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const isNew = !event?.id;
  const isEditableByUser = isNew || currentUser?.id === event.user_id;

  const [edit, setEdit] = useState(null);
  const [title, setTitle] = useState(event.title || "");
  const [address, setAddress] = useState(event.address || "");
  const [status, setStatus] = useState(event.status || "open");
  const [email, setEmail] = useState(event.email || "");
  const [phone, setPhone] = useState(event.phone || "");
  const [description, setDescription] = useState(event.description || "");

  // Reset form values when event changes
  useEffect(() => {
    setTitle(event.title || "");
    setAddress(event.address || "");
    setStatus(event.status || "open");
    setEmail(event.email || "");
    setPhone(event.phone || "");
    setDescription(event.description || "");
    setEdit(null);
  }, [event]);

  // Automatically show or close modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleSave = async () => {
    const method = isNew ? "POST" : "PATCH";
    const url = isNew ? "/api/events" : `/api/events/${event.id}`;

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
          // Add user_id if creating a new post
          ...(isNew && currentUser ? { user_id: currentUser.id } : {}),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      // Get the updated data
      const savedData = await response.json();

      setEdit(null);
      // Pass updated data back to parent
      onClose(savedData);
    } catch (err) {
      console.error(err);
    }
  };

  const render = (label, value, setValue, name, type = "text") => {
    const isEdit = edit === name;

    return (
      <div className="field">
        <label className={name}>
          <strong>{label}:</strong>
        </label>
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
            <Button name="Cancel" onClick={() => setEdit(null)} />
            <Button name="Save" onClick={handleSave} />
          </>
        ) : (
          <>
            <p className={name}>{value}</p>
            {isEditableByUser && (
              <Button name="Edit" onClick={() => setEdit(name)} />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <dialog
      className="modal"
      key={event.id}
      ref={dialogRef}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* {event.image && (
        <img src={event.image.src} alt={event.image.alt} className="image" />
      )} */}

      {render("Title", title, setTitle, "title")}

      {render("Address", address, setAddress, "address")}

      <label>
        <strong>Status:</strong>
      </label>
      {isEditableByUser && edit === "status" ? (
        <>
          <select onChange={(e) => setStatus(e.target.value)} value={status}>
            <option value="open">Open</option>
            <option value="progress">In Progress...</option>
            <option value="closed">Closed</option>
          </select>
          <Button name="Cancel" onClick={() => setEdit(null)} />
          <Button name="Save" onClick={handleSave} />
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
        {Object.values(comments)?.map(
          (comment, index) =>
            comment.event_id === event.id && (
              <p key={index}>
                <strong>{event.username}</strong>: {comment}
              </p>
            )
        )}
      </div>

      <div className="modal-actions">
        <Button name="Close" onClick={onClose} />
        {isNew && <Button name="Create Post" onClick={handleSave} />}
      </div>
    </dialog>
  );
}
