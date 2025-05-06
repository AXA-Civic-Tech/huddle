import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import { logUserOut } from "../adapters/auth-adapter";
import Button from "./Button";

/**
 * Need to add Log Out functionality if current user is logged in
 * Need to add View Map functionality if current user is logged in
 * Needs a condition depending on the page the user is in
 * Profile page: View Map & Log Out
 * Map page: View Profile & Log Out
 * Homepage (Map): Sign Up & Log In
 * @returns
 */

export default function NavBar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear user from context
    logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <header>
      <a id="logo" href="/">
        Huddle
      </a>
      <nav>
        <ul>
          {/* When user IS logged in */}
          {currentUser && (
            <>
              {/* On ProfilePage, show View Map and Log Out */}
              {pathname === `/users/${currentUser.id}` && (
                <>
                  <li>
                    <Button name="View Map" to="/" />
                  </li>
                  <li>
                    <Button name="Log Out" onClick={handleLogout} />
                  </li>
                </>
              )}

              {/* On HomePage, show My Profile and Log Out */}
              {pathname === "/" && (
                <>
                  <li>
                    <Button name="My Profile" to={`/users/${currentUser.id}`} />
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
                <Button name="Sign Up" to="/signup" />
              </li>
              <li>
                <Button name="Log In" to="/login" />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
