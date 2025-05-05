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

export const updatePost = async (postData) => {
  // Validate postData
  if (!postData) {
    console.error("No data provided to updatePost");
    return [null, new Error("No data provided to updatePost")];
  }

  // For new posts (no ID), use POST
  if (!postData.id) {
    console.error("Creating new post with data:", postData);
    return createPost(postData);
  }
  // For existing posts, use PATCH
  const { id, ...updateData } = postData;
  console.log(`Updating post ${id} with data:`, updateData);
  return fetchHandler(`${baseUrl}/${id}`, getPatchOptions(updateData));
};

export const deletePost = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
