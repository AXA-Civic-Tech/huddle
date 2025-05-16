import { useContext, useState, useEffect, useRef } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { createPost, updatePost, deletePost } from "../adapters/post-adapter";
import Button from "./Button";
import EventForm from "./Modal_children/EventForm";
import EventView from "./Modal_children/EventView";
import CommentsSection from "./Modal_children/CommentsSection";

/**
 * Main container component that orchestrates the display of event details.
 * Manages dialog state, determines edit/view mode, and handles user permissions.
 *
 * @param {Object} event - The event/issue data object
 * @param {boolean} isOpen - Controls whether the modal is displayed
 * @param {Function} onClose - Callback for when modal is closed
 * @param {boolean} viewing - Force view-only mode regardless of permissions
 * @returns {JSX.Element} Modal dialog component
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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // Determine initial component state based on event data
  const isNew = !event?.id;
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id && !viewing);
  const [isEdit, setIsEdit] = useState(isNew);

  /**
   * Reset edit mode when event changes
   * Ensures proper mode when switching between events
   */
  useEffect(() => {
    setIsEdit(isNew);
  }, [event, isNew]);

  /**
   * Fetch username of event creator
   * Handles error cases and missing user data
   */
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

  /**
   * Control dialog open/close state
   * Uses browser's native dialog API
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  /**
   * Process form submission
   * Validates, formats, and saves event data
   *
   * @param {Object} formData - Form field values to save
   */
  const handleSave = async (formData) => {
    try {
      const requiredFields = ["title", "borough", "zipcode", "description"];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (missingFields.length > 0) {
        alert(
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      const postData = {
        ...formData,
        zipcode: formData.zipcode.replace(/[^0-9]/g, "").slice(0, 5),
      };

      if (event && event.id) {
        postData.id = event.id;
      }

      if (isNew && currentUser && currentUser.id) {
        postData.user_id = currentUser.id;
      }

      const [result, error] = isNew
        ? await createPost(postData)
        : await updatePost(postData);

      if (error) {
        console.error("Error saving post:", error);
        return;
      }

      setIsEdit(false);
      onClose(result);
    } catch (err) {
      console.error("Error in save process:", err);
    }
  };

  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  // Cancel edit operation without saving changes
  const cancelEdit = () => {
    // For new posts, close the modal completely
    if (isNew) {
      onClose();
    } else {
      // For existing posts, return to view mode
      setIsEdit(false);
    }
  };

  return (
    <dialog
      className="modal"
      key={event.id}
      ref={dialogRef}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget && !isWidgetOpen) {
          onClose();
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Button
          name="✕"
          className="close-icon"
          onClick={() => onClose()}
          aria-label="Close"
        />

        {isEdit ? (
          <EventForm
            event={event}
            username={username}
            currentUser={currentUser}
            onSave={handleSave}
            onCancel={cancelEdit}
            onClose={onClose}
            dialogRef={dialogRef}
            setIsWidgetOpen={setIsWidgetOpen}
          />
        ) : (
          <>
            <div className="modal-display">
              <div
                className={`event-images ${
                  Array.isArray(event.images) && event.images.length > 1
                    ? "event-image-grid"
                    : ""
                }`}
              >
                {/* Handle when images is an array with content */}
                {Array.isArray(event.images) &&
                  event.images.length > 0 &&
                  event.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Event ${index + 1}`}
                      className="event-image"
                      onError={(e) => {
                        console.error("Image failed to load:", img);
                        e.target.src =
                          "https://via.placeholder.com/600x400?text=Image+Not+Available";
                        e.target.alt = "Image not available";
                      }}
                    />
                  ))}
                {event.images && (
                  <img
                    src={event.images}
                    alt="Event"
                    // style={{ maxWidth: "200px", height: "auto" }}
                    className="event-image"
                    onError={(e) => {
                      console.error("Image failed to load:", img);
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=Image+Not+Available";
                      e.target.alt = "Image not available";
                    }}
                  />
                )}

                {/* Handle when no images are available */}
                {(!event.images ||
                  !Array.isArray(event.images) ||
                  event.images.length === 0) && (
                  <div className="event-image">No image available</div>
                )}
              </div>

              <div className="event-content">
                <EventView
                  event={event}
                  username={username}
                  onClose={onClose}
                />

                <div className="modal-actions">
                  {isEditableByUser && !isNew && (
                    <Button name="Edit Post" onClick={toggleEditMode} />
                  )}
                </div>

                {/* Delete button only appears is user is viewing their own post - isEditable is true */}
                {isEditableByUser && !isNew && (
                  <Button
                    name="Delete Post"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this post?"
                        )
                      ) {
                        const [_, error] = await deletePost(event.id);
                        if (!error) {
                          onClose();
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {event.id && (
              <CommentsSection eventId={event.id} onClose={onClose} />
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
