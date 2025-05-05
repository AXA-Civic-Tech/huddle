import { fetchHandler, getPostOptions, deleteOptions } from "../utils/fetchingUtils";

// Get all comments for an event/post
export const getCommentsByEvent = async (eventId) => {
  return await fetchHandler(`/api/events/${eventId}/comments`);
};

// Create a new comment
export const createComment = async ({ user_id, contents, event_id }) => {
  return await fetchHandler(
    "/api/comments",
    getPostOptions({ user_id, contents, event_id })
  );
};

// Delete a comment
export const deleteComment = async (commentId) => {
  return await fetchHandler(`/api/comments/${commentId}`, deleteOptions);
}; 