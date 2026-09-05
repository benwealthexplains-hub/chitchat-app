import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSessionUnlocked, markSessionUnlocked } from "../lib/pin";
import PinPad from "../components/PinPad";

export default function LockScreen() {
  const { user, profile, loading, verifyUserPin, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [shakeTrigger, setShakeTrigger] = useState(0);

  if (loading) return <div className="center-loader">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.pinHash) return <Navigate to="/set-pin" replace />;
  if (isSessionUnlocked(user.uid)) return <Navigate to="/chats" replace />;

  async function handleComplete(pin) {
    const ok = await verifyUserPin(pin);
    if (ok) {
      markSessionUnlocked(user.uid);
      navigate("/chats", { replace: true });
    } else {
      setError("Incorrect PIN. Try again.");
      setShakeTrigger((t) => t + 1);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <div className="lock-screen">
        <div className="lock-icon">🔒</div>
        <h1 className="lock-title">
          Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
        </h1>
        <p className="lock-subtitle">Enter your PIN to unlock ChitChat</p>
        {error && <div className="lock-error">{error}</div>}
        <PinPad onComplete={handleComplete} shakeTrigger={shakeTrigger} />
        <button className="lock-forgot" onClick={handleLogout}>
          Not you? Log out
        </button>
      </div>
    </div>
  );
}
