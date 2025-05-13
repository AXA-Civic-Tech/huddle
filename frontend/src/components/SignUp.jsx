import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import CurrentUserContext from "../contexts/current-user-context";
import { registerUser, checkUsernameAvailability } from "../adapters/auth-adapter";

//The site key remains public as it's a PUBLIC KEY
const SITE_KEY = "6Lf1FC8rAAAAAJ4egdXJ_RkeePpHowuY1ZFKb20S"; // from Google

// Controlling the sign up form is a good idea because we want to add (eventually)
// more validation and provide real time feedback to the user about usernames and passwords
export default function SignUpForm() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [errorText, setErrorText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

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
      console.error('Error checking username:', error);
      setUsernameAvailable(true); // Assume available on error to not block registration
    }
    setIsCheckingUsername(false);
  };

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
    navigate(`/users/${user.id}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "username") {
      setUsername(value);
      checkUsername(value);
    }
    if (name === "password") setPassword(value);
  };

  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} aria-labelledby="create-heading">
        <h2 id="create-heading">Create New User</h2>

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
        {isCheckingUsername && <span>Checking username availability...</span>}
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

        {/* In reality, we'd want a LOT more validation on signup, so add more things if you have time
        <label htmlFor="password-confirm">Password Confirm</label>
        <input autoComplete="off" type="password" id="password-confirm" name="passwordConfirm" />
      */}

        {/* reCAPTCHA */}
        <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptchaChange} />

        <button type="submit" disabled={!usernameAvailable || isCheckingUsername}>
          Sign Up Now!
        </button>
      </form>
      {!!errorText && <p className="error">{errorText}</p>}
    </>
  );
}
