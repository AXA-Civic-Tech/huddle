import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUsername } from "../adapters/user-adapter";

export default function UpdateUsernameForm({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrMsg("");

    const formData = new FormData(event.target);
    const [user, error] = await updateUsername(Object.fromEntries(formData));

    // If we get an error response
    if (error) {
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
      setErrMsg("Ann error occurred. Please try again.");
      return;
    }
    // Success case
    setCurrentUser(user);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="update-heading">
      <h2 id="update-heading">Update User {currentUser.username} </h2>
      <label htmlFor="username">New Username</label>
      <input type="text" id="username" name="username" />
      <input type="hidden" name="id" value={currentUser.id} />

      <button>Update Username</button>
    </form>
  );
}
