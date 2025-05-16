import { useState, useContext, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

  const [authOverlayOpen, setAuthOverlayOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");
  const [loadingUser, setLoadingUser] = useState(true);

  /**
   * Opens the auth overlay with specified mode
   * @param {string} mode - Authentication mode to display ('login' or 'signup')
   */
  const openAuthOverlay = useCallback((mode = "login") => {
    setAuthMode(mode);
    setAuthOverlayOpen(true);
  }, []);

  // Closes the authentication overlay
  const closeAuthOverlay = useCallback(() => {
    setAuthOverlayOpen(false);
  }, []);

  // Check for logged in user on initial load
  useEffect(() => {
    const loadCurrentUser = async () => {
      const [data] = await checkForLoggedInUser();
      if (data) setCurrentUser(data);
      setLoadingUser(false);
    };

    loadCurrentUser();
  }, [setCurrentUser]);

  // Trigger auth overlay for protected routes when user isn't logged in
  useEffect(() => {
    if (
      !loadingUser &&
      !currentUser &&
      location.pathname.startsWith("/users/")
    ) {
      setRedirectAfterLogin(location.pathname);
      openAuthOverlay("login");
    }
  }, [
    currentUser,
    location.pathname,
    openAuthOverlay,
    setRedirectAfterLogin,
    loadingUser,
  ]);

  // Close overlay after successful login
  useEffect(() => {
    if (currentUser && authOverlayOpen) {
      closeAuthOverlay();
    }
  }, [currentUser, authOverlayOpen, closeAuthOverlay]);

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
