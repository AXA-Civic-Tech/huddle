import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import UserContext from "../contexts/current-user-context";

/**
 * A wrapper component that ensures the user is authenticated before rendering its children.
 * If user is not authenticated, it triggers the authentication overlay and stores the
 * current path for redirection after successful login.
 *
 * @param {RequireAuthProps} props - Component props
 * @returns {React.ReactNode} The protected children if authenticated, otherwise nothing
 *
 * @example
 * // Basic usage
 * <RequireAuth openAuthOverlay={openAuthOverlay} setRedirectAfterLogin={setRedirectPath}>
 *   <ProtectedComponent />
 * </RequireAuth>
 */

export default function RequireAuth({
  children,
  openAuthOverlay,
  setRedirectAfterLogin,
}) {
  const { currentUser } = useContext(UserContext);
  // Get current location to save for redirect after login
  const location = useLocation();

  if (!currentUser) {
    // Save the current path to redirect to after successful login
    setRedirectAfterLogin(location.pathname);
    // Open the login overlay
    openAuthOverlay("login");

    // Redirect to home but preserve intended path in location.state
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }
  // Return children when authenticated
  return children;
}
