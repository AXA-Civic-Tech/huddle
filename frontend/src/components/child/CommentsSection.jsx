import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/current-user-context";
import { upvoteEvent, getUpvoteCount } from "../../adapters/upvote-adapter";
import {
  createComment,
  getCommentsByEvent,
} from "../../adapters/comment-adapter";
import UserLink from "../UserLink";
import Button from "./Button";

/**
 * Component for displaying and managing comments and upvotes on an event.
 * Handles loading comments, posting new comments, and upvoting functionality.
 *
 * @param {string|number} eventId - ID of the event to show comments for
 * @returns {JSX.Element} Comments and upvotes section
 */

export default function CommentsSection({ eventId, onClose }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);

  /**
   * Load comments and upvote count when component mounts
   * or when eventId changes
   */
  useEffect(() => {
    if (eventId) {
      loadComments();
      loadUpvoteCount();
    }
  }, [eventId]);

  /**
   * Fetch and process comments for the current event
   * Handles nested arrays and filters out invalid comments
   */
  const loadComments = async () => {
    const data = await getCommentsByEvent(eventId);
    const allComments = (data || [])
      .flat() // flatten nested arrays
      .filter((comment) => comment && typeof comment === "object"); // remove null values
    setComments(allComments);
  };

  // Fetch the current upvote count for the event
  const loadUpvoteCount = async () => {
    const data = await getUpvoteCount(eventId);
    setUpvoteCount(data[0].count);
  };

  /**
   * Handle posting a new comment
   * Validates user authentication and comment content
   */
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUser?.id) {
      alert("You must be logged in to post a comment");
      return;
    }

    await createComment({
      user_id: currentUser.id,
      contents: newComment,
      event_id: eventId,
    });

    setNewComment(""); // Clear input
    loadComments(); // Refresh comments
  };

  /**
   * Handle upvoting an event
   * Validates user authentication before processing
   */
  const handleUpvote = async () => {
    if (!currentUser?.id) {
      alert("You must be logged in to upvote.");
      return;
    }

    await upvoteEvent(eventId);
    loadUpvoteCount(); // Refresh upvote count
  };

  return (
    <div className="comments">
      <h3>Comments</h3>
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
        />
        <Button name="Post" onClick={handlePostComment} />
      </div>

      {/* render upvotes */}
      <div className="upvotes">
        <span>Upvotes: {upvoteCount}</span>
        <Button name="Upvote" onClick={handleUpvote} />
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div className="comment" key={index}>
              <UserLink
                userId={comment.user_id}
                username={comment.username || "User"}
                onClose={onClose}
              >
                <strong>{comment.username || "User"}:</strong>
              </UserLink>{" "}
              {comment.contents}
            </div>
          ))
        ) : (
          <p>No comments yet!</p>
        )}
      </div>
    </div>
  );
}
