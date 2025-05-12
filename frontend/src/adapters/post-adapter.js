import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions
} from "../utils/fetchingUtils";

const baseUrl = "/api/posts";

export const createPost = async (postData) => {
  console.log("Creating post with data:", JSON.stringify(postData, null, 2));
  try {
    const result = await fetchHandler(baseUrl, getPostOptions(postData));
    console.log("Create post response:", result);
    return result;
  } catch (error) {
    console.error("Create post error:", error);
    return [null, error];
  }
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
  return fetchHandler(`${baseUrl}/${id}`, deleteOptions);
};
