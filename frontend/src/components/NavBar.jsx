import { useContext } from "react";
import { useLocation, useNavigate, NavLink, useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { logUserOut } from "../adapters/auth-adapter";
import Button from "./Button";

/**
 * Root (HomePage): If user is NOT signed in, "Sign Up" & "Log In"
 * Root (HomePage): If user signed in, "My Profile" & "Log Out"
 * UserPage: If user is logged in, "View Map" & "Log Out"
 * @returns
 */

export default function NavBar({ openAuthOverlay }) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const location = useLocation();
  const pathname = location.pathname;
  const { id: urlUserId } = useParams();

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear user from context
    logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <header className="navbar-header">
      <a className="navbar-logo" href="/">
        <img src="/huddle-icon.png" alt="logo" className="navbar-icon" /> Huddle
      </a>
      <nav className="navbar-nav">
        <ul className="navbar-links">
          {/* When user IS logged in */}
          {currentUser && (
            <>
              <li className="navbar-item">
                <Button name="My Profile" to={`/users/${currentUser.id}`} />
                {/* <NavLink to={`/users/${currentUser.id}`}>
                      My Profile
                    </NavLink> */}
              </li>

              <li className="navbar-item">
                <Button name="Log Out" onClick={handleLogout} />
              </li>
            </>
          )}

          {/* When user is NOT logged in and on HomePage */}
          {!currentUser && location.pathname === "/" && (
            <>
              <li className="navbar-item">
                {/* Trigger modal open instead of navigating */}
                <button
                  className="navbar-link"
                  onClick={() => openAuthOverlay("signup")}
                  type="button"
                >
                  Sign Up
                </button>
              </li>
              <li className="navbar-item">
                <button
                  className="navbar-link"
                  onClick={() => openAuthOverlay("login")}
                  type="button"
                >
                  Log In
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
