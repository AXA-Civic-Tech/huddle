import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "./contexts/current-user-context";
import { checkForLoggedInUser } from "./adapters/auth-adapter";
import HomePage from "./pages/HomePage";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import NavBar from "./components/NavBar";
import NotFoundPage from "./pages/NotFoundPage";
import UsersPage from "./pages/Users";
import UserPage from "./pages/UserPage";

export default function App() {
  const { setCurrentUser } = useContext(UserContext);
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
          {/* Please Review the Repetive Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginSignUpPage />} />
          <Route path="/signup" element={<LoginSignUpPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/main" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
