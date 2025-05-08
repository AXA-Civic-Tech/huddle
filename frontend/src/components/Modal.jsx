import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { updatePost } from "../adapters/post-adapter";
import { createComment, getCommentsByEvent } from "../adapters/comment-adapter";
import UserLink from "./UserLink";
import Button from "./Button";

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
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const isNew = !event?.id;
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id && !viewing);

  const [isEdit, setIsEdit] = useState(isNew);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);

  // Form fields
  const [formData, setFormData] = useState({
    title: event.title || "",
    address: event.address || "",
    borough: event.borough || "",
    state: event.state || "",
    zipcode: event.zipcode || "",
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
      borough: event.borough || "",
      state: event.state || "",
      zipcode: event.zipcode || "",
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

  useEffect(() => {
    if (!isEdit && event.id) {
      getCommentsByEvent(event.id).then((data) => {
        // flatten and filter as needed
        const allComments = (data || [])
          .flat() // flatten nested arrays
          .filter((comment) => comment && typeof comment === "object"); // remove null values
        setComments(allComments);
      });
    }
  }, [isEdit, event.id]);

  useEffect(() => {
    getUpvoteCount(event.id).then((data) => {
      setUpvoteCount(data[0].count);
    });
  }, [event.id]);

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
        // id: event.id,
      };

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
      borough: event.borough || "",
      state: event.state || "",
      zipcode: event.zipcode || "",
      status: event.status || "open",
      email: event.email || "",
      phone: event.phone || "",
      description: event.description || "",
    });
    setIsEdit(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    await createComment({
      user_id: currentUser.id,
      contents: newComment,
      event_id: event.id,
    });
    setNewComment(""); // Clear input
    // Refresh comments
    const data = await getCommentsByEvent(event.id);
    const flatComments = (data || [])
      .flat()
      .filter((comment) => comment && typeof comment === "object");
    setComments(flatComments);
  };

  const handleUpvote = async () => {
   await upvoteEvent(event.id);
   const count = await getUpvoteCount(event.id);
   // update the upvote count
   // access the count from the response
    setUpvoteCount(count[0].count);
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
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePostComment();
            }
          }}
        />
        <Button name="Post" onClick={handlePostComment} />

        {/* render upvotes */}
        <div className="upvotes">
        <span>Upvotes: {upvoteCount}</span>
        <Button name="Upvote" onClick={handleUpvote} />
        </div>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <p key={index}>
              <span onClick={() => onClose()}>
                <UserLink
                  userId={comment.user_id}
                  username={comment.username || "User"}
                >
                  <strong>{comment.username || "User"}:</strong>
                </UserLink>
              </span>{" "}
              {comment.contents}
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
            {renderField("borough", "Borough")}
            {renderField("state", "State")}
            {renderField("zipcode", "Zip Code", "number")}
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
            {renderField("borough", "Borough")}
            {renderField("state", "State")}
            {renderField("zipcode", "Zip Code")}
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
