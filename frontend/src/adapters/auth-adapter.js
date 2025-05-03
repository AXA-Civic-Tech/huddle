import {
  fetchHandler,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/auth";

export const registerUser = async ({
  firstName,
  lastName,
  email,
  username,
  password,
}) => {
  return fetchHandler(
    `${baseUrl}/register`,
    getPostOptions({ 
      username, 
      password,
      email,
      first_name: firstName,
      last_name: lastName
    })
  );
};

export const logUserIn = async ({ username, password }) => {
  return fetchHandler(
    `${baseUrl}/login`,
    getPostOptions({ username, password })
  );
};

export const logUserOut = async () => {
  return fetchHandler(`${baseUrl}/logout`, deleteOptions);
};

export const checkForLoggedInUser = async () => {
  return await fetchHandler(`${baseUrl}/me`);
};
