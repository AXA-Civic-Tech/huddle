import {
  fetchHandler,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";

const baseUrl = "/api/auth";

export const registerUser = async ({
  first_name,
  last_name,
  email,
  username,
  password,
  recaptchaToken
}) => {
  return fetchHandler(
    `${baseUrl}/register`,
    getPostOptions({
      username,
      password,
      email,
      first_name,
      last_name,
      recaptchaToken
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

export const checkUsernameAvailability = async (username) => {
  const response = await fetch(`${baseUrl}/check-username/${encodeURIComponent(username)}`);
  const data = await response.json();
  return data.available;
};
