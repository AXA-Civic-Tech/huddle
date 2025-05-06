import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import LoginForm from "../components/Login";
import SignUpForm from "../components/SignUp";

export default function LoginSignUpPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

  const [activeForm, setActiveForm] = useState("signup");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  // users shouldn't be able to see the login page if they are already logged in.
  // if the currentUser exists in the context, navigate the user to
  // the /users/:id page for that user, using the currentUser.id value
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  useEffect(() => {
    pathname === "/login" ? setActiveForm("login") : setActiveForm("signup");
  }, [pathname]);

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
