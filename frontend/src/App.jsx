import { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
    </>
  );
}
