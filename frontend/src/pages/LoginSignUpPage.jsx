import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/Login";
import SignUpForm from "../components/SignUp";

/**
 * If "Sign Up" button was clicked on "/", "Sign Up" form will show and able to switch to "Log In"
 * If "Log In" button was clicked on "/", "Log In" form will show and able to switch to "Sign Up"
 * @returns
 */

export default function LoginSignUpPage() {
  const location = useLocation();
  const pathname = location.pathname;

  const [activeForm, setActiveForm] = useState("signup");

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
