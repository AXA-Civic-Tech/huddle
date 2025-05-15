import { fetchHandler, getPostOptions, deleteOptions } from "../utils/fetchingUtils";

// Get upvote count for an event/post
export const getUpvoteCount = async (eventId) => {
  const [response, error] = await fetchHandler(`/api/events/${eventId}/upvotes`);
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

// Grab all upvotes by User

export const getUpvotesByUser = async (userId) => {
  return await fetchHandler(`/api/upvotes/users/${userId}`)
 
}