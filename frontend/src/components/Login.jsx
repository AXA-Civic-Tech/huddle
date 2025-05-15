import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the redirect path from location state, or default to home
  const from = location.state?.from || "/";

  const [errorText, setErrorText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");

    // Add client-side validation to check if username and password are provided
    if (!username || !password) {
      setErrorText("Please provide botha username and a password.");
      return;
    }

    const [user, error] = await logUserIn({ username, password });
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    // Navigate to the original page the user was trying to access
    navigate(from, { replace: true });
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} aria-labelledby="login-heading">
        <h2 id="login-heading">Log back in!</h2>
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

        <button>Log in!</button>
      </form>
      {/* If there is an error, display it */}
      {!!errorText && <p>{errorText}</p>}
    </>
  );
}
