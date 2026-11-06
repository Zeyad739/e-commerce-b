import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, token, currentUser } = useSelector((state) => state.users);
  const location = useLocation();

  const isAuth = isAuthenticated || Boolean(token || localStorage.getItem("auth_token"));

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires admin permissions
  const isAdmin = currentUser?.role === "admin" || currentUser?.username === "emilys";
  if (adminOnly && !isAdmin) {
    // If a regular customer attempts to access admin route, redirect to home or profile
    return <Navigate to="/profile" replace />;
  }

  return children;
}
