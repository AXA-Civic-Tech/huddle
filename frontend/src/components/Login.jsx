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

    const [user, error] = await logUserIn({ username, password });
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
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

        <button>Log in!</button>
      </form>
      {!!errorText && <p>{errorText}</p>}
    </>
  );
}
