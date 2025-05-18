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
 * @param {string|number} eventId - ID of the event to show comments for
 * @returns {JSX.Element} Comments and upvotes section
 */

export default function CommentsSection({ eventId, onClose, openAuthOverlay }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load comments and upvote count when component mounts
   * or when eventId changes
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
   * Fetch and process comments for the current event
   * Handles nested arrays and filters out invalid comments
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

  // Fetch the current upvotes (list) for the event
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

  // Check if the current user has upvoted
  const hasUpvoted =
    currentUser && upvotes.some((u) => u.user_id === currentUser.id);
  const upvoteCount = upvotes.length;

  /**
   * Handle posting a new comment
   * Validates user authentication and comment content
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
   * Handle upvoting an event
   * Validates user authentication before processing
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
          <span className="upvote-count">{upvoteCount}</span>
          <Button
            className={`upvote-button ${hasUpvoted ? "upvote-active" : ""}`}
            onClick={handleUpvoteToggle}
            disabled={isLoading}
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
          >
            <span className="upvote-icon">{hasUpvoted ? "❤️" : "🖤"}</span>
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
          comments.map((comment, index) => (
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
          <p className="no-comments">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
