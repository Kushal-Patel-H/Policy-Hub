// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return null; // Or a loading spinner while checking auth
  if (!user) return <Navigate to="/" replace />; // Redirect to Welcome if not logged in

  return children; // Allow access if logged in
}
