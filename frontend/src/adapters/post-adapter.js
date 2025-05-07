import { fetchHandler } from "../utils/fetchingUtils";

export const getAllPosts = async () => {
    return await fetchHandler('/api/posts');
  };

  