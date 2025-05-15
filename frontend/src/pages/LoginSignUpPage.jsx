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
      <div className="login-signup-container">
        {/* Left Side - Info Section */}
        <div className="info-section">
          <h1 className="app-title">Huddle</h1>
          <h3 className="app-subtitle">One map. Infinite stories.</h3>
          <p className="section-label">Mission Statement:</p>
          <p className="mission-text">
            Our mission is to create a web app where any New Yorker can, in
            under 30 seconds, post or discover neighborhood issues and events.
            By unifying 311-style reports and community activities on a
            real-time, interactive map, we aim to turn isolated data points into
            shared civic awareness and spark faster, collective responses across
            neighborhoods.
          </p>

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

        {/* Right Side - Form Section */}
        <div className="form-section">
          <div className="form-wrapper">
            {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
          </div>
        </div>
      </div>
    </>
  );
}
