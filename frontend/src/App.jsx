import { useState, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import UserContext from "./contexts/current-user-context";
import { checkForLoggedInUser } from "./adapters/auth-adapter";
import HomePage from "./pages/HomePage";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import UsersPage from "./pages/Users";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function App() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();

  // Auth overlay state lifted here
  const [authOverlayOpen, setAuthOverlayOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // or "login"

  const openAuthOverlay = (mode = "signup") => {
    setAuthMode(mode);
    setAuthOverlayOpen(true);
  };

  const closeAuthOverlay = () => {
    setAuthOverlayOpen(false);
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      // we aren't concerned about an error happening here
      const [data] = await checkForLoggedInUser();
      if (data) setCurrentUser(data);
    };

    loadCurrentUser();
  }, [setCurrentUser]);

  return (
    <>
      <NavBar openAuthOverlay={openAuthOverlay} />
      <main>
        <Routes>
          {/* Main page */}
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

          {/* Auth pages */}
          <Route path="/login" element={<LoginSignUpPage />} />
          <Route path="/signup" element={<LoginSignUpPage />} />

          {/* User profile pages */}
          <Route path="/users" element={<UsersPage />} />
          <Route
            path="/users/:id"
            element={
              currentUser ? (
                <UserPage />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
