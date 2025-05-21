import { useState, useContext, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import UserContext from "./contexts/current-user-context";
import { checkForLoggedInUser } from "./adapters/auth-adapter";
import HomePage from "./pages/HomePage";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import UsersPage from "./pages/Users";
import NavBar from "./components/NavBar";
import RequireAuth from "./components/RequireAuth";
import Footer from "./components/Footer";

/**
 * Main application component responsible for routing and global state management.
 * Handles authentication state, protected routes, and application-wide user context.
 * Manages authentication overlays and redirects for protected content.
 *
 * Key responsibilities:
 * - Route configuration and rendering
 * - User authentication state management
 * - Conditional rendering of auth overlay
 * - Persisting login state across refreshes
 * - Managing redirects for protected routes
 *
 * @returns {JSX.Element} The complete application with routing and global UI elements
 */

export default function App() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Controls whether auth overlay (login/signup modal) is open
  const [authOverlayOpen, setAuthOverlayOpen] = useState(false);
  // Current mode for auth overlay: 'login' or 'signup'
  const [authMode, setAuthMode] = useState("login");
  // Path to redirect after successful login
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");
  // Flag for initial loading state while checking if user is logged in
  const [loadingUser, setLoadingUser] = useState(true);

  /**
   * Opens the authentication overlay and sets mode and redirect path.
   *
   * @function
   * @param {string} [mode="login"] - The auth mode to display ('login' or 'signup')
   * @param {string} [redirectPath=pathname] - Path to redirect after login
   */
  const openAuthOverlay = useCallback(
    (mode = "login", redirectPath = pathname) => {
      setAuthMode(mode);
      setRedirectAfterLogin(redirectPath);
      setAuthOverlayOpen(true);
    },
    [pathname]
  );

  // Closes the authentication overlay
  const closeAuthOverlay = useCallback(() => {
    setAuthOverlayOpen(false);
  }, []);

  /**
   * On initial component mount, checks if there is a logged-in user session.
   * Updates currentUser state if a user is found, and sets loadingUser to false.
   *
   * @effect Runs once on mount
   */
  useEffect(() => {
    const loadCurrentUser = async () => {
      const [data] = await checkForLoggedInUser();
      if (data) setCurrentUser(data);
      setLoadingUser(false);
    };

    loadCurrentUser();
  }, [setCurrentUser]);

  /**
   * After a successful login (currentUser is set) while the auth overlay is open,
   * closes the overlay and navigates to the stored redirect path.
   *
   * @effect Runs when currentUser, authOverlayOpen, navigate, or redirectAfterLogin changes
   */
  useEffect(() => {
    if (currentUser && authOverlayOpen) {
      setAuthOverlayOpen(false);
      navigate(redirectAfterLogin, { replace: true });
    }
  }, [currentUser, authOverlayOpen, navigate, redirectAfterLogin]);

  /**
   * If the user is not logged in and is trying to access a protected route (starting with '/users/'),
   * automatically triggers the login overlay and sets redirect path to the attempted route.
   *
   * @effect Runs when currentUser, pathname, openAuthOverlay, or loadingUser changes
   */
  useEffect(() => {
    if (!loadingUser && !currentUser && pathname.startsWith("/users/")) {
      openAuthOverlay("login", pathname);
    }
  }, [currentUser, pathname, openAuthOverlay, loadingUser]);

  // While loading user data, render nothing to avoid flicker
  if (loadingUser) return null;

  return (
    <>
      <NavBar
        openAuthOverlay={openAuthOverlay}
        closeAuthOverlay={closeAuthOverlay}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                authOverlayOpen={authOverlayOpen}
                authMode={authMode}
                closeAuthOverlay={closeAuthOverlay}
                openAuthOverlay={openAuthOverlay}
              />
            }
          />

          <Route
            path="/users/:id"
            element={
              <RequireAuth
                openAuthOverlay={openAuthOverlay}
                setRedirectAfterLogin={setRedirectAfterLogin}
              >
                <UserPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {authOverlayOpen && (
        <div
          className="glassmorphic-overlay"
          onClick={closeAuthOverlay}
          aria-modal="true"
          role="dialog"
        >
          <LoginSignUpPage
            initialForm={authMode}
            onClose={closeAuthOverlay}
            redirectAfterLogin={redirectAfterLogin}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
