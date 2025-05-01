import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import LoginForm from "../components/Login";
import SignUpForm from "../components/SignUp";

export default function HomePage() {
  const [activeForm, setActiveForm] = useState("signup");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const navigate = useNavigate();

  // users shouldn't be able to see the login page if they are already logged in.
  // if the currentUser exists in the context, navigate the user to
  // the /users/:id page for that user, using the currentUser.id value
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  return (
    <>
      <h1>Huddle</h1>
      <p>One map. Infinite stories.</p>

      <div>
        {activeForm === "login" ? (
          <>
            <p>Don't have an account?</p>
            <button onClick={() => setActiveForm("signup")}>Sign Up</button>
          </>
        ) : (
          <>
            <p>Have an account?</p>
            <button onClick={() => setActiveForm("login")}>Log In</button>
          </>
        )}
      </div>

      <div className="form">
        {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </>
  );
}
