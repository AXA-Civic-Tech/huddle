import { fetchHandler, getPostOptions, deleteOptions } from "../utils/fetchingUtils";

// Get upvote count for an event/post
export const getUpvoteCount = async (eventId) => {
  return await fetchHandler(`/api/events/${eventId}/upvotes`);
};

// Upvote an event/post
export const upvoteEvent = async (eventId) => {
  return await fetchHandler(
    `/api/events/${eventId}/upvote`, 
    getPostOptions({})
  );
};

// Remove an upvote
export const removeUpvote = async (eventId) => {
  return await fetchHandler(
    `/api/events/${eventId}/upvote`,
    deleteOptions
  );
}; 