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

  useEffect(() => {
    pathname === "/login" ? setActiveForm("login") : setActiveForm("signup");
  }, [pathname]);

  // If user is logged in, redirect to their profile page.
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  // If user is on the root path and not logged in, redirect to the main page
  if (pathname === "/") return <Navigate to="/" />;

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
