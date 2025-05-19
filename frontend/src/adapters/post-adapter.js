import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/posts";

export const createPost = async (postData) => {
  if (!postData) {
    console.error("createPost: postData is undefined");
    return [null, "No post data provided"];
  }

  //spreads body and checks for issue value and image to be array regardless of size
const postBody = {
  ...postData,
  is_issue: String(postData.is_issue === "Issue" || postData.is_issue === true),
  images: Array.isArray(postData.images)
    ? postData.images
    : postData.images
    ? [postData.images]
    : [],
};


  try {
    const result = await fetchHandler("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify(postBody), 
    });
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
  return await fetchHandler(`${baseUrl}/${id}`);
};

export const updatePost = async (postId, postData) => {
  if (!postData) {
    console.error("updatePost: postData is undefined");
    return [null, "No post data provided"];
  }

  const postBody = {
    ...postData,
    is_issue: String(postData.is_issue === "Issue" || postData.is_issue === true),
  };

  try {
    const result = await fetchHandler(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, // important for JSON
      body: JSON.stringify(postBody),
    });

    return result;
  } catch (error) {
    console.error("Update post error:", error);
    return [null, error];
  }
};

export const deletePost = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`, deleteOptions);
};