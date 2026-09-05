import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSessionUnlocked } from "../lib/pin";

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="center-loader">Loading ChitChat…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // New account that hasn't chosen a PIN yet.
  if (!profile?.pinHash) {
    return <Navigate to="/set-pin" replace />;
  }

  // Returning session in a fresh tab — ask for the PIN before showing chats.
  if (!isSessionUnlocked(user.uid)) {
    return <Navigate to="/lock" replace />;
  }

  return children;
}
