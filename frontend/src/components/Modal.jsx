import { useContext, useState, useEffect, useRef } from "react";
import { SquarePen, Trash2, X } from "lucide-react";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { createPost, updatePost, deletePost } from "../adapters/post-adapter";
import EventForm from "./Modal_children/EventForm";
import EventView from "./Modal_children/EventView";
import CommentsSection from "./Modal_children/CommentsSection";
import ImageContainer from "./Modal_children/ImageContainer";

/**
 * A modal dialog that displays either an event form (for creating or editing)
 * or a detailed view of an event/issue. Includes logic for permissions,
 * editing, deleting, saving, and fetching related user data.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.event - Event or issue data object
 * @param {boolean} props.isOpen - Controls whether the modal is displayed
 * @param {Function} props.onClose - Callback to handle modal close
 * @param {boolean} [props.viewing=false] - Optional view-only mode
 * @param {Function} props.openAuthOverlay - Callback to show auth overlay if user not logged in
 * @param {boolean} props.authOverlayOpen - Determines if auth overlay is currently open
 * @returns {JSX.Element|null} A modal component for viewing/editing an event
 */

export default function Modal({
  event = {},
  isOpen,
  onClose,
  viewing = false,
  openAuthOverlay,
  authOverlayOpen,
}) {
  // Don't render modal if auth overlay is open
  if (authOverlayOpen) return null;

  // DOM reference for modal dialog element
  const dialogRef = useRef();

  // Access current logged-in user from context
  const { currentUser } = useContext(CurrentUserContext);

  // Username of event owner
  const [username, setUsername] = useState("Loading...");

  // Toggles whether any internal widgets (like image upload) are open
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // True if creating a new post
  const isNew = !event?.id;

  // Determines if user has permission to edit post
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id && !viewing);

  // Toggles between edit and view mode
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
      const requiredFields = ["title", "address", "description"];
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
        : await updatePost(postData.id, postData);

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const [_, error] = await deletePost(event.id);
      if (!error) onClose();
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
      <X className="close-icon" onClick={() => onClose()} />

      {/* Either display EventForm or EventView */}
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
          {/* Contains Image and Content */}
          <div className="modal-content">
            {/* Image Container */}
            <div className="event-images">
              <ImageContainer
                images={event.images}
                altText={event.title || "Event"}
                fallbackImage="https://placehold.co/600x400?text=Image+Not+Available"
              />
            </div>

            {/* Content Container */}
            <div className="event-content">
              <EventView event={event} username={username} onClose={onClose} />

              {/* Edit & Delete button only appears is user is viewing their own post - isEditable is true */}
              <div className="modal-actions">
                {isEditableByUser && !isNew && (
                  <>
                    <SquarePen className="edit-icon" onClick={toggleEditMode} />
                    <Trash2 className="delete-icon" onClick={handleDelete} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {event.id && (
            <CommentsSection
              eventId={event.id}
              onClose={onClose}
              openAuthOverlay={openAuthOverlay}
            />
          )}
        </>
      )}
    </dialog>
  );
}
