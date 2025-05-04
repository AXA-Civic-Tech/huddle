import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";

/**
 * Need to add Log Out functionality if current user is logged in
 * Need to add View Map functionality if current user is logged in
 * Needs a condition depending on the page the user is in
 * Profile page: View Map & Log Out
 * Map page: View Profile & Log Out
 * Homepage (Map): Sign Up & Log In
 * @returns
 */

export default function SiteHeadingAndNav() {
  const { currentUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <header>
      <a id="logo" href="/">
        Huddle
      </a>
      <nav>
        <ul>
          {currentUser && (
            <>
              {pathname === `/users.${currentUser.id}` && (
                <>
                  <li>
                    <Button name="View Map" to="/map" />
                  </li>
                  <li>
                    <Button name="Log Out" onClick={handleLogout} />
                  </li>
                </>
              )}

              {pathname === "/map" && (
                <>
                  <li>
                    <Button
                      name="View Profile"
                      to={`/users/${currentUser.id}`}
                    />
                  </li>
                  <li>
                    <Button name="Log Out" onClick={handleLogout} />
                  </li>
                </>
              )}
            </>
          )}

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
