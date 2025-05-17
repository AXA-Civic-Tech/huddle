import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import UserContext from "../contexts/current-user-context";

export default function RequireAuth({ children }) {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login with original location in state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
