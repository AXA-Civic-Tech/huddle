import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/current-user-context";
import {
  upvoteEvent,
  removeUpvote,
  getUpvoteCount,
} from "../../adapters/upvote-adapter";
import {
  createComment,
  getCommentsByEvent,
} from "../../adapters/comment-adapter";
import UserLink from "../UserLink";
import Button from "../Button";

/**
 * Component for displaying and managing comments and upvotes on an event.
 * Handles loading comments, posting new comments, and upvoting functionality.
 *
 * @param {Object} props
 * @param {string|number} props.eventId - ID of the event to show comments and upvotes for.
 * @param {function} props.onClose - Callback function to close the comments section.
 * @param {function} props.openAuthOverlay - Function to open the authentication overlay (login/signup).
 * @returns {JSX.Element} Comments and upvotes UI section
 */

export default function CommentsSection({ eventId, onClose, openAuthOverlay }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads comments and upvotes when the component mounts
   * or whenever the eventId changes.
   * Sets loading state during fetch.
   */
  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      Promise.all([loadComments(), loadUpvotes()]).finally(() =>
        setIsLoading(false)
      );
    }
  }, [eventId]);

  /**
   * Fetches comments for the event, flattens nested arrays,
   * filters out invalid comments, and updates state.
   * @async
   * @returns {Promise<Array>} Array of comment objects
   */
  const loadComments = async () => {
    try {
      const data = await getCommentsByEvent(eventId);
      const allComments = (data || [])
        .flat() // flatten nested arrays
        .filter((comment) => comment && typeof comment === "object"); // remove null values
      setComments(allComments);
      return allComments;
    } catch (error) {
      console.error("Error loading comments:", error);
      return [];
    }
  };

  /**
   * Fetches the current upvotes list for the event,
   * filters invalid entries, and updates state.
   * @async
   * @returns {Promise<Array>} Array of upvote objects
   */
  const loadUpvotes = async () => {
    try {
      const data = await getUpvoteCount(eventId);
      const filtered = (data || []).filter(
        (u) => u && typeof u === "object" && u.user_id
      );
      setUpvotes(filtered);
      return filtered;
    } catch (error) {
      console.error("Error loading upvotes:", error);
      return [];
    }
  };

  // Boolean indicating if current user has upvoted the event
  const hasUpvoted =
    currentUser && upvotes.some((u) => u.user_id === currentUser.id);
  // Total number of upvotes
  const upvoteCount = upvotes.length;

  /**
   * Handles posting a new comment.
   * Checks for empty comment or user authentication,
   * posts the comment, clears input, and reloads comments.
   * @async
   */
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUser?.id) {
      openAuthOverlay("login", window.location.pathname);
      return;
    }

    try {
      setIsLoading(true);
      await createComment({
        user_id: currentUser.id,
        contents: newComment,
        event_id: eventId,
      });

      setNewComment(""); // Clear input
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles upvote status for the event by the current user.
   * Requires user to be authenticated.
   * Calls API to add or remove upvote and reloads upvotes.
   * @async
   */
  const handleUpvoteToggle = async () => {
    if (!currentUser?.id) {
      // alert("You must be logged in to upvote.");
      openAuthOverlay("login", window.location.pathname);
      return;
    }

    try {
      setIsLoading(true);
      if (hasUpvoted) {
        await removeUpvote(eventId);
      } else {
        await upvoteEvent(eventId);
      }
      await loadUpvotes();
    } catch (error) {
      console.error("Error toggling upvote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comments">
      <div className="comments-header">
        <h3>Comments</h3>

        {/* Upvotes section */}
        <div className="upvote-section">
          <span className="upvote-label">Upvotes:</span>
          <span className="upvote-count">{upvoteCount}</span>
          <Button
            className={`upvote-button ${hasUpvoted ? "upvote-active" : ""}`}
            onClick={handleUpvoteToggle}
            disabled={isLoading}
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
          >
            <span className="upvote-icon">
              <img
                src={hasUpvoted ? "/huddle-icon.png" : "/huddle-grayscale.png"}
                alt={hasUpvoted ? "Upvoted" : "Not upvoted"}
                style={{ width: 24, height: 24 }}
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Comment input */}
      <div className="comment-input">
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
          disabled={isLoading}
        />
        <Button
          name="Post"
          onClick={handlePostComment}
          disabled={isLoading || !newComment.trim()}
        />
      </div>

      {/* Comments list */}
      <div className="comments-list">
        {isLoading && comments.length === 0 ? (
          <p className="loading-text">Loading comments...</p>
        ) : comments.length > 0 ? (
          [...comments]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((comment, index) => (
              <div className="comment" key={index}>
                <UserLink
                  userId={comment.user_id}
                  username={comment.username || "User"}
                  onClose={onClose}
                >
                  <strong>{comment.username || "User"}</strong>
                </UserLink>{" "}
                <span className="comment-content">{comment.contents}</span>
              </div>
            ))
        ) : (
          <p className="no-comment">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
