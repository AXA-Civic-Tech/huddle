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

export default function NavBar() {
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

  // Check if we're viewing another user's profile
  const isViewing =
    currentUser && urlUserId && currentUser.id !== parseInt(urlUserId);

  return (
    <header>
      <a className="logo" href="/">
        <img src="/huddle-icon.png" alt="logo" className="logo" /> Huddle
      </a>
      <nav>
        <ul>
          {/* When user IS logged in */}
          {currentUser && (
            <>
              {/* On UserPage, show View Map and Log Out */}
              {pathname.includes(`/users/`) && (
                <>
                  <li>
                    {/* <Button name="View Map" to="/" /> */}
                    <NavLink to="/">View Map</NavLink>
                  </li>
                  {isViewing && (
                    <li>
                      {/* <Button name='My Profile' to={`/users/${currentUser.id}`} /> */}
                      <NavLink to={`/users/${currentUser.id}`}>
                        My Profile
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <Button name="Log Out" onClick={handleLogout} />
                  </li>
                </>
              )}

              {/* On HomePage, show My Profile and Log Out */}
              {pathname === "/" && (
                <>
                  <li>
                    {/* <Button name="My Profile" to={`/users/${currentUser.id}`} /> */}
                    <NavLink to={`/users/${currentUser.id}`}>
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <Button name="Log Out" onClick={handleLogout} />
                  </li>
                </>
              )}
            </>
          )}

          {/* When user is NOT logged in and on HomePage */}
          {!currentUser && pathname === "/" && (
            <>
              <li>
                {/* <Button name="Sign Up" to="/signup" /> */}
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
              <li>
                {/* <Button name="Log In" to="/login" /> */}
                <NavLink to="/login">Log In</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
