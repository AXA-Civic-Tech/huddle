import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUsername } from "../adapters/user-adapter";

/**
 * Renders a form inside a dialog allowing the current user to update their username.
 * Displays error messages if the username is already taken or other errors occur.
 * Upon successful update, updates the currentUser state and resets the form.
 * Redirects to home page on certain authentication errors.
 *
 * @param {Object} props
 * @param {Object} props.currentUser - The currently authenticated user object
 * @param {Function} props.setCurrentUser - Function to update the currentUser state
 * @returns {JSX.Element} The username update form component
 */

export default function UpdateUsernameForm({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  /**
   * Handles the form submission to update the username.
   *
   * Prevents default form submission behavior.
   * Calls the updateUsername adapter with form data.
   * Handles errors for username conflicts and authentication issues.
   * On success, updates currentUser state and resets the form.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrMsg("");

    const formData = new FormData(event.target);
    const [user, error] = await updateUsername(Object.fromEntries(formData));

    // If we get an error response
    if (error) {
      console.log("Error received:", error);

      // Check if it's conflict (username already taken)
      if (error.cause === 409) {
        setErrMsg("Username already taken. Please try another.");
        return;
      }

      // Handle other auth errors
      if (error.cause >= 400 && error.cause < 500) {
        setCurrentUser(null);
        return navigate("/");
      }

      // Handle any other errors
      setErrMsg("An error occurred. Please try again.");
      return;
    }
    // Success case
    setCurrentUser(user);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="update-heading">
      <h2 id="update-heading">Update Username</h2>
      <h3 className="update-username">{currentUser.username}</h3>
      <label htmlFor="username" id="new-username">
        New Username
      </label>
      <input type="text" id="username" name="username" />
      <input type="hidden" name="id" value={currentUser.id} />

      <button>Update Username</button>

      {/* Display error message if present */}
      {errMsg && (
        <div className="error" role="alert">
          {errMsg}
        </div>
      )}
    </form>
  );
}
