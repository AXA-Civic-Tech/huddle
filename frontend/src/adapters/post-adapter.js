import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/posts";

export const createPost = async (postData) => {
  return fetchHandler(baseUrl, getPostOptions(postData));
};

export const getAllPosts = async () => {
  return await fetchHandler(baseUrl);
};

export const getPost = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`);
};

export const updatePost = async ({ postData }) => {
  // For new posts (no ID), use POST
  if (!postData.id) createPost(postData);

  // For existing posts, use PATCH
  const { id, ...updateData } = postData;
  return fetchHandler(`${baseUrl}/${id}`, getPatchOptions({ id }));
};

export const deletePost = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
