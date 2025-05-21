import { useState, useEffect } from "react";
import LoginForm from "../components/Login";
import SignUpForm from "../components/SignUp";
import Button from "../components/Button";

/**
 * LoginSignUpPage component displaying authentication forms with app information.
 * Serves as the primary entry point for user authentication, toggling between login
 * and signup forms while displaying the app's mission statement.
 *
 * @param {Object} props - Component props
 * @param {string} [props.initialForm="signup"] - Which form to display initially ('login' or 'signup')
 * @param {Function} props.onClose - Handler called when auth process completes or is cancelled
 * @param {string} [props.redirectAfterLogin] - Path to redirect to after successful login
 *
 * @returns {JSX.Element} Authentication page with togglable login/signup forms and mission info
 */

export default function LoginSignUpPage({
  initialForm = "signup",
  onClose,
  redirectAfterLogin,
}) {
  const [activeForm, setActiveForm] = useState(initialForm);

  /**
   * Syncs the activeForm state with the initialForm prop.
   * This allows the parent to control which form is shown dynamically.
   */
  useEffect(() => {
    setActiveForm(initialForm);
  }, [initialForm]);

  // Determine if current form is login or signup
  const isLogin = activeForm === "login";

  // Prompt text shown below the form to toggle between login/signup
  const promptText = isLogin ? "Don't have an account?" : "Have an account?";

  // Button label text for toggling forms
  const buttonText = isLogin ? "Sign Up" : "Log In";

  // Form name to switch to on button click
  const nextForm = isLogin ? "signup" : "login";

  return (
    <>
      <div className="info-section">
        <h1 className="app-title">Huddle</h1>

        <h3 className="app-subtitle">One map. Infinite stories.</h3>

        <p className="section-label">
          <strong>Mission Statement:</strong>
        </p>

        <p className="mission-text">
          We are ending loneliness in New York City by bridging the visibility
          gap between neighbors. Our platform surfaces hyper-local events and
          issues in real time—so you can spot what is happening on your block,
          RSVP, and jump into the conversation. The goal: timely information
          that sparks connection, resilience, and a stronger sense of community
          for every New Yorker.
        </p>
      </div>

      <div
        className="form-wrapper glassmorphic"
        onClick={(e) => e.stopPropagation()}
      >
        {isLogin ? (
          <LoginForm
            onClose={onClose}
            redirectAfterLogin={redirectAfterLogin}
          />
        ) : (
          <SignUpForm onClose={onClose} />
        )}

        <div className="switch-form-prompt">
          <p>{promptText}</p>

          <Button
            name={buttonText}
            onClick={() => setActiveForm(nextForm)}
            className="switch-form-button"
          />
        </div>
      </div>
    </>
  );
}
