import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import UserContext from "../contexts/current-user-context";

/**
 * A wrapper component that protects routes from unauthorized access.
 * If the user is not authenticated (`currentUser` is null), they are redirected
 * to the login page. Otherwise, the protected content (`children`) is rendered.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The protected component(s) to render when authenticated
 * @returns {React.ReactNode} The protected content or a redirect to the login page
 */

export default function RequireAuth({ children }) {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login with original location in state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
