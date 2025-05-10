import { useContext, useState, useEffect, useRef } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { updatePost } from "../adapters/post-adapter";
import Button from "./child/Button";
import EventForm from "./child/EventForm";
import EventView from "./child/EventView";
import CommentsSection from "./child/CommentsSection";

/**
 * @params event, isOpen, onClose, viewing
 * Reusable Component in 3 different ways:
 * 1. Create a new post (modal)
 * 2. Render existing issues/events
 * 3. Editable post (modal)
 * After the Post card is clicked from the Feed, Modal will pop in front of the Map
 * @returns
 */

export default function Modal({
  event = {},
  isOpen,
  onClose,
  viewing = false,
}) {
  const dialogRef = useRef();
  const { currentUser } = useContext(CurrentUserContext);
  const [username, setUsername] = useState("Loading...");

  const isNew = !event?.id;
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id && !viewing);
  const [isEdit, setIsEdit] = useState(isNew);

  // Reset edit mode when event changes
  useEffect(() => {
    setIsEdit(isNew);
  }, [event, isNew]);

  // Fetch username of event creator
  useEffect(() => {
    const fetchUsername = async () => {
      if (!event?.user_id) {
        setUsername("Unknown User");
        return;
      }

      const [userData, error] = await getUser(event.user_id);

      if (error || !userData) {
        console.error("Error fetching username:", error);
        setUsername("Unknown User");
        return;
      }

      setUsername(userData?.username);
    };

    fetchUsername();
  }, [event?.user_id]);

  // Control dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleSave = async (formData) => {
    try {
      // Validate required fields
      const requiredFields = ["title", "borough", "zipcode", "description"];
      const missingFields = [];

      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        alert(
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      // Prepare data for API
      const postData = {
        ...formData,
      };

      // Clean the zipcode (ensure it's only digits)
      if (postData.zipcode) {
        postData.zipcode = postData.zipcode.replace(/[^0-9]/g, "").slice(0, 5);
      }

      // Only include ID if it exist (for updates)
      if (event && event.id) {
        postData.id = event.id;
      }

      // Only include user_id if creating a new post
      if (isNew && currentUser && currentUser.id) {
        postData.user_id = currentUser.id;
      }

      // Call the API
      const [updatedPost, error] = await updatePost(postData);

      if (error) {
        console.error("Error saving post:", error);
        return;
      }

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
    setIsEdit(false);
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
          <EventForm
            event={event}
            username={username}
            currentUser={currentUser}
            onSave={handleSave}
            onCancel={cancelEdit}
          />
        ) : (
          <>
            <EventView event={event} username={username} />

            {event.id && <CommentsSection eventId={event.id} />}

            <div className="modal-actions">
              {isEditableByUser && !isNew && (
                <Button name="Edit Post" onClick={toggleEditMode} />
              )}
              <Button name="Close" onClick={() => onClose()} />
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
