import { Link, useLocation } from "react-router-dom";

/**
 * UserLink component renders a link to a user's profile page.
 *
 * It optionally triggers a callback function when the link is clicked (e.g., to close a modal).
 * The link preserves the current location pathname in the navigation state.
 *
 * @param {Object} props
 * @param {string|number} props.userId - The unique ID of the user to link to.
 * @param {string} props.username - The username to display as link text if children are not provided.
 * @param {Function} [props.onClose] - Optional callback function triggered on link click.
 * @param {React.ReactNode} [props.children] - Optional children to render inside the link instead of username.
 *
 * @returns {JSX.Element} The rendered user profile link component.
 */

export default function UserLink({ userId, username, onClose, children }) {
  const location = useLocation();

  return (
    <Link
      to={`/users/${userId}`}
      onClick={(e) => onClose()}
      state={{ from: location.pathname }}
      className="user-link"
    >
      {children || username || "Unknown User"}
    </Link>
  );
}
