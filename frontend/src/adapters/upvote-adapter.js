import { fetchHandler, getPostOptions, deleteOptions } from "../utils/fetchingUtils";

// Get upvote count for an event/post
export const getUpvoteCount = async (eventId) => {
  console.log("Getting upvote count for event:", eventId);
  const response = await fetchHandler(`/api/events/${eventId}/upvotes`);
  console.log("Upvote count response:", response);
  return response;
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