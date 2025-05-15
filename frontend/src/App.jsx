import { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import UserContext from "./contexts/current-user-context";
import { checkForLoggedInUser } from "./adapters/auth-adapter";
import HomePage from "./pages/HomePage";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import UsersPage from "./pages/Users";
import NavBar from "./components/NavBar";

export default function App() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();

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
      <NavBar />
      <main>
        <Routes>
          {/* Main page */}
          <Route path="/" element={<HomePage />} />

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

      <footer className="footer">
        <p>
          {`Copyright © ${new Date().getFullYear()} `}
          <Link
            to="https://github.com/AXA-Civic-Tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            AXA
          </Link>
        </p>

        <p>All Rights Reserved</p>

        <p className="contributors">
          <span className="contributor">
            <Link
              to="https://github.com/autumnlydon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Autumn Lydon
            </Link>
            <Link
              to="https://www.linkedin.com/in/autumnlydon/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/linkedin-icon.png"
                alt="Autumn's LinkedIn"
                className="icon"
              />
            </Link>
          </span>

          <span className="dot"> • </span>

          <span className="contributor">
            <Link
              to="https://github.com/Nakuziri"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xavier Campos
            </Link>
            <Link
              to="https://www.linkedin.com/in/xavier-campos-97b6b3268/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/linkedin-icon.png"
                alt="Xavier's LinkedIn"
                className="icon"
              />
            </Link>
          </span>

          <span className="dot"> • </span>

          <span className="contributor">
            <Link
              to="https://github.com/AthenaC"
              target="_blank"
              rel="noopener noreferrer"
            >
              Athena Chang
            </Link>
            <Link
              to="https://www.linkedin.com/in/athena-chang/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/linkedin-icon.png"
                alt="Athena's LinkedIn"
                className="icon"
              />
            </Link>
          </span>
        </p>
      </footer>
    </>
  );
}
