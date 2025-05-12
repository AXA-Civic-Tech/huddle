import { Link } from "react-router-dom";

/**
 * Component for rendering links to user profiles.
 * Includes callback capability for navigation events.
 *
 * @param {string|number} userId - ID of the user to link to
 * @param {string} username - Username to display in the link
 * @param {Function} onClose - Optional callback when link is clicked
 * @param {ReactNode} children - Content to display inside the link
 * @returns {JSX.Element} Link to user profile
 */

export default function UserLink({ userId, username, onClose, children }) {
  return (
    <Link to={`/users/${userId}`} onClick={(e) => onClose()}>
      {children || username}
    </Link>
  );
}
