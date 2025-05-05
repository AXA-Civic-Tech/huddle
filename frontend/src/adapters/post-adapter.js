import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/posts";

export const createPost = async ({ title, address, status, email, phone }) => {
  return fetchHandler(
    baseUrl,
    getPostOptions({ title, address, status, email, phone })
  );
};

export const getAllPosts = async () => {
  return await fetchHandler(baseUrl);
};

export const getPost = async (id) => {
  return fetchHandler(`${baseUrl}/${id}`);
};

export const updatePost = async ({ id }) => {
  return fetchHandler(`${baseUrl}/${id}`, getPatchOptions({ id }));
};
