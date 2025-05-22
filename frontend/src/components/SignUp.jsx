

import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import CurrentUserContext from "../contexts/current-user-context";
import {
  registerUser,
  checkUsernameAvailability,
} from "../adapters/auth-adapter";
import Button from "./Button";

/**
 * SignUpForm component for user registration.
 * Manages form state, real-time validation, reCAPTCHA verification, and API integration.
 * Provides immediate feedback on username availability and input validation.
 *
 * Features:
 * - Real-time username availability checking
 * - Form validation for all required fields
 * - reCAPTCHA integration for bot prevention
 * - Error state handling and display
 * - Context updates on successful registration
 * - Support for redirect after successful registration
 *
 * @param {Object} props - Component props
 * @param {function():void} props.onClose - Callback fired after registration completes (success or cancel)
 * @returns {JSX.Element} Registration form with validation and submission handling
 */

export default function SignUpForm({ onClose }) {
  const SITE_KEY = "6Lf1FC8rAAAAAJ4egdXJ_RkeePpHowuY1ZFKb20S";

  const navigate = useNavigate();
  const location = useLocation();
  // Get the redirect path from location state, or default to home
  const from = location.state?.from || "/";

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [errorText, setErrorText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for username availability checking
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // Tracks if we're currently checking username
  const [usernameAvailable, setUsernameAvailable] = useState(true); // Tracks if the username is available

  /**
   * Checks if a username is available by making an API call.
   * Updates UI state to reflect checking and result.
   *
   * @param {string} username - The username to check
   * @returns {Promise<void>} Resolves when availability check completes
   */
  const checkUsername = async (username) => {
    if (!username) {
      setUsernameAvailable(true);
      return;
    }

    setIsCheckingUsername(true);

    try {
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(true); // Assume available on error to not block registration
    }

    setIsCheckingUsername(false);
  };

  /**
   * Handles form submission.
   * Validates inputs, verifies reCAPTCHA, registers user via API,
   * updates context, redirects user, and closes overlay.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");

    // Basic validation
    if (!username || !password) {
      return setErrorText("Username and password are required");
    }
    if (password.length < 6) {
      return setErrorText("Password must be at least 6 characters");
    }
    if (!email.includes("@")) {
      return setErrorText("Please enter a valid email address");
    }
    // Additional validation to prevent submission if username is taken
    if (!usernameAvailable) {
      return setErrorText("Username is already taken");
    }

    if (!recaptchaToken) {
      return alert("Please complete the reCAPTCHA");
    }

    const [user, error] = await registerUser({
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,
      recaptchaToken,
    });

    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    onClose();
    // Navigate to the original page the user was trying to access
    navigate(from, { replace: true });
  };

  /**
   * Handles input changes for all form fields.
   * Updates corresponding state values and triggers username availability check when relevant.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "username") {
      setUsername(value);
      // Check username availability whenever the username field changes
      checkUsername(value);
    }
    if (name === "password") setPassword(value);
  };

  /**
   * reCAPTCHA change handler
   * Updates state with token when verification completes
   *
   * @param {string} token - The verification token from reCAPTCHA
   */
  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <>
      <form onSubmit={handleSubmit} aria-labelledby="create-heading">
        <h1>Be a Team Player</h1>

        <div className="name-inputs">
          <div className="first-name">
            <label htmlFor="firstName">First Name</label>
            <input
              autoComplete="off"
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              value={firstName}
              required
            />
          </div>

          <div className="last-name">
            <label htmlFor="lastName">Last Name</label>
            <input
              autoComplete="off"
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              value={lastName}
              required
            />
          </div>
        </div>

        <label htmlFor="email">Email</label>
        <input
          autoComplete="off"
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          value={email}
          required
        />

        <label htmlFor="username">Username</label>
        <input
          autoComplete="off"
          type="text"
          id="username"
          name="username"
          onChange={handleChange}
          value={username}
          required
        />

        {/* Show loading state while checking username */}
        {isCheckingUsername && <span>Checking username availability...</span>}
        {/* Show error message if username is taken */}
        {!isCheckingUsername && !usernameAvailable && (
          <span className="error">Username is already taken</span>
        )}

        <label htmlFor="password">Password</label>
        <input
          autoComplete="off"
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          value={password}
          required
          minLength={6}
        />

        {/* Password validation on sign up */}
        <label htmlFor="password-confirm">Password Confirm</label>
        <input
          autoComplete="off"
          type="password"
          id="password-confirm"
          name="passwordConfirm"
        />

        {/* reCAPTCHA */}
        <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptchaChange} />

        {/* Disable submit button if username is taken or while checking availability */}
        <Button
          name="Sign Up Now!"
          type="submit"
          disabled={!usernameAvailable || isCheckingUsername || !recaptchaToken}
        />
      </form>

      {!!errorText && <p className="error">{errorText}</p>}
    </>
  );
}
