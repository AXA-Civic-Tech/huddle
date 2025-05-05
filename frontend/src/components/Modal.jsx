import { useContext, useState, useEffect, useRef } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import Button from "./Button";
import { updatePost } from "../adapters/post-adapter";

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
  const { currentUser } = useContext(CurrentUserContext);

  const isNew = !event?.id;
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id);

  const [isEdit, setIsEdit] = useState(isNew);

  // Form fields
  const [formData, setFormData] = useState({
    title: event.title || "",
    address: event.address || "",
    status: event.status || "open",
    email: event.email || "",
    phone: event.phone || "",
    description: event.description || "",
  });

  // Reset form values when event changes
  useEffect(() => {
    setFormData({
      title: event.title || "",
      address: event.address || "",
      status: event.status || "open",
      email: event.email || "",
      phone: event.phone || "",
      description: event.description || "",
    });
    setIsEdit(isNew);
  }, [event, isNew]);

  // Automatically show or close modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API
      const postData = {
        ...formData,
        // Include ID for updates
        id: event.id,
      };

      // Only include user_id if creating a new post
      if (isNew && currentUser) {
        postData.user_id = currentUser.id;
      }

      // Call the API
      const [updatedPost, error] = await updatePost(postData);

      if (error) {
        console.error("Error saving post:", error);
        return;
      }

      console.log("Save successful:", updatedPost);

      // Exit edit mode
      setIsEdit(false);
      // Close modal and pass data back to parent
      onClose(updatedPost);
    } catch (err) {
      console.error("Error in save process:", err);
    }
  };

  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  const cancelEdit = () => {
    // Reset form data to original values
    setFormData({
      title: event.title || "",
      address: event.address || "",
      status: event.status || "open",
      email: event.email || "",
      phone: event.phone || "",
      description: event.description || "",
    });
    setIsEdit(false);
  };

  // Reusable field rendering functions
  const renderField = (name, label, type = "text") => {
    if (isEdit) {
      if (type === "textarea") {
        return (
          <div className="field" key={name}>
            <label htmlFor={name}>
              <strong>{label}:</strong>
            </label>
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              rows="4"
            />
          </div>
        );
      } else if (type === "select") {
        return (
          <div className="field" key={name}>
            <label htmlFor={name}>
              <strong>{label}:</strong>
            </label>
            <select
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="progress">In Progress...</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        );
      } else {
        return (
          <div className="field" key={name}>
            <label htmlFor={name}>
              <strong>{label}:</strong>
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
            />
          </div>
        );
      }
    } else {
      return (
        <div className="field" key={name}>
          <strong>{label}:</strong>
          <p>{formData[name]}</p>
        </div>
      );
    }
  };

  const renderComments = () => {
    if (isEdit) return null;

    return (
      <div className="comments">
        <h3>Comments</h3>
        {Object.values(comments || {}).length > 0 ? (
          Object.values(comments)
            .filter((comment) => comment.event_id === event.id)
            .map((comment, index) => (
              <p key={index}>
                <strong>{comment.username || "User"}:</strong> {comment.content}
              </p>
            ))
        ) : (
          <p>No comments yet!</p>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (isEdit) {
      return (
        <div className="modal-actions">
          <Button name="Cancel" onClick={cancelEdit} />
          <Button
            name={isNew ? "Create Post" : "Save Changes"}
            onClick={handleSave}
          />
        </div>
      );
    } else {
      return (
        <div className="modal-actions">
          {isEditableByUser && !isNew && (
            <Button name="Edit Post" onClick={toggleEditMode} />
          )}
          <Button name="Close" onClick={() => onClose()} />
        </div>
      );
    }
  };

  return (
    <dialog
      className="modal"
      key={event.id}
      ref={dialogRef}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* {event.image && (
        <img src={event.image.src} alt={event.image.alt} className="image" />
      )} */}

        {isEdit ? (
          <form className="edit-form">
            {renderField("title", "Title")}
            {renderField("address", "Address")}
            {renderField("status", "Status", "select")}
            {renderField("email", "Email", "email")}
            {renderField("phone", "Phone", "tel")}
            {renderField("description", "Description", "textarea")}
            {renderActions()}
          </form>
        ) : (
          <>
            {renderField("title", "Title")}
            {renderField("address", "Address")}
            {renderField("status", "Status")}
            {renderField("email", "Email")}
            {renderField("phone", "Phone")}
            {renderField("description", "Description")}
            {renderComments()}
            {renderActions()}
          </>
        )}
      </div>
    </dialog>
  );
}
