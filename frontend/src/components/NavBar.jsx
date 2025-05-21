import { useContext } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { logUserOut } from "../adapters/auth-adapter";
import Button from "./Button";

/**
 * Navigation bar component providing contextual navigation links based on authentication state.
 * Conditionally renders different navigation options depending on:
 * - Whether user is authenticated
 * - Current location in the application
 * - User permissions/roles
 *
 * Navigation states:
 * - Root (HomePage) with unauthenticated user: "Sign Up" & "Log In"
 * - Root (HomePage) with authenticated user: "My Profile" & "Log Out"
 * - UserPage with authenticated user: "My Profile" & "Log Out"
 *
 * @param {Object} props - Component props
 * @param {function(string):void} props.openAuthOverlay - Function to open the authentication overlay with a mode ('login' or 'signup')
 * @param {function():void} props.closeAuthOverlay - Function to close the authentication overlay
 * @returns {JSX.Element} Navigation header with contextual navigation options
 */

export default function NavBar({ openAuthOverlay, closeAuthOverlay }) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const location = useLocation();

  /**
   * Handles user logout process:
   * - Calls logout API to invalidate user session
   * - Clears current user from context
   * - Redirects user to homepage
   *
   * @returns {void}
   */
  const handleLogout = () => {
    logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <header className="navbar-header">
      <NavLink
        className="navbar-logo"
        to="/"
        onClick={(e) => closeAuthOverlay()}
      >
        <img src="/huddle-icon.png" alt="logo" className="navbar-icon" /> Huddle
      </NavLink>

      <nav className="navbar-nav">
        <ul className="navbar-links">
          {currentUser && (
            <>
              <li className="navbar-item">
                <Button name="My Profile" to={`/users/${currentUser.id}`} />
              </li>

              <li className="navbar-item">
                <Button name="Log Out" onClick={handleLogout} />
              </li>
            </>
          )}

          {!currentUser && location.pathname === "/" && (
            <>
              <li className="navbar-item">
                <Button
                  name="Sign Up"
                  onClick={() => openAuthOverlay("signup")}
                  className="navbar-link"
                />
              </li>

              <li className="navbar-item">
                <Button
                  name="Log In"
                  onClick={() => openAuthOverlay("login")}
                  className="navbar-link"
                />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
