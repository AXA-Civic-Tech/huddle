import { useState, useEffect } from "react";
import LoginForm from "../components/Login";
import SignUpForm from "../components/SignUp";

export default function LoginSignUpPage({ initialForm = "signup", onClose }) {
  const [activeForm, setActiveForm] = useState(initialForm);

  // Update active form when initialForm changes (in case of mode switch)
  useEffect(() => {
    setActiveForm(initialForm);
  }, [initialForm]);

  return (
    <>
      <div className="info-section">
        <h1 className="app-title">Huddle</h1>
        <h3 className="app-subtitle">One map. Infinite stories.</h3>
        <p className="section-label">Mission Statement:</p>
        <p className="mission-text">
          Our mission is to create a web app where any New Yorker can, in under
          30 seconds, post or discover neighborhood issues and events. By
          unifying 311-style reports and community activities on a real-time,
          interactive map, we aim to turn isolated data points into shared civic
          awareness and spark faster, collective responses across neighborhoods.
        </p>
      </div>

      <div
        className="form-wrapper glassmorphic"
        onClick={(e) => e.stopPropagation()}
      >
        {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
        <div className="switch-form-prompt">
          {activeForm === "login" ? (
            <>
              <p>Don't have an account?</p>
              <button
                className="switch-form-button"
                onClick={() => setActiveForm("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <p>Have an account?</p>
              <button
                className="switch-form-button"
                onClick={() => setActiveForm("login")}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
