import { NavLink } from "react-router-dom";
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

  return (
    <header>
      <a id="logo" href="/">
        Huddle
      </a>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          {currentUser ? (
            <>
              <li>
                <NavLink to="/users" end={true}>
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink to={`/users/${currentUser.id}`}>
                  {currentUser.username}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
