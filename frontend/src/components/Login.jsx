import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import Button from "./Button";

/**
 * Login form component for user authentication.
 * Handles form state, validation, API communication, and post-login redirects.
 * Integrates with the application's user context to update authentication state.
 *
 * Features:
 * - Username/password input collection and validation
 * - Error state handling and display
 * - Integration with auth adapter for login API requests
 * - Context updates on successful authentication
 * - Support for redirect after successful login
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Handler called after login attempt (success or failure)
 * @param {string} props.redirectAfterLogin - Path to redirect to after successful login
 * @returns {JSX.Element} Login form with username/password fields and submission button
 */

export default function LoginForm({ onClose, redirectAfterLogin = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the redirect path from location state, or default to home
  const from = redirectAfterLogin || location.state?.from || "/";

  const [errorText, setErrorText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  /**
   * Form submission handler
   * Validates inputs, attempts login via API, and handles response
   *
   * @param {Event} event - Form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");

    // Add client-side validation to check if username and password are provided
    if (!username || !password) {
      setErrorText("Please provide both: A username and a password.");
      return;
    }

    const [user, error] = await logUserIn({ username, password });
    if (error) return setErrorText("Incorrect username or password.");

    setCurrentUser(user);
    onClose();
    // Navigate to the original page the user was trying to access
    navigate(from, { replace: true });
  };

  return (
    <>
      <form onSubmit={handleSubmit} aria-labelledby="login-heading">
        <h1>Huddle Up!</h1>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          autoComplete="username"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button name="Log In!" type="submit" />
      </form>

      {!!errorText && <p>{errorText}</p>}
    </>
  );
}
