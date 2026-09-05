import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSessionUnlocked, markSessionUnlocked } from "../lib/pin";
import PinPad from "../components/PinPad";

export default function SetPin() {
  const { user, profile, loading, setUserPin } = useAuth();
  const navigate = useNavigate();
  const [stage, setStage] = useState("create"); // "create" | "confirm"
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [shakeTrigger, setShakeTrigger] = useState(0);

  if (loading) return <div className="center-loader">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.pinHash) {
    return <Navigate to={isSessionUnlocked(user.uid) ? "/chats" : "/lock"} replace />;
  }

  async function handleComplete(pin) {
    if (stage === "create") {
      setFirstPin(pin);
      setError("");
      setStage("confirm");
      return;
    }

    if (pin !== firstPin) {
      setError("PINs didn't match — try again.");
      setShakeTrigger((t) => t + 1);
      setTimeout(() => {
        setFirstPin("");
        setStage("create");
      }, 450);
      return;
    }

    await setUserPin(pin);
    markSessionUnlocked(user.uid);
    navigate("/chats", { replace: true });
  }

  return (
    <div className="app-shell">
      <div className="lock-screen">
        <div className="lock-icon">🔒</div>
        <h1 className="lock-title">
          {stage === "create" ? "Create a PIN" : "Confirm your PIN"}
        </h1>
        <p className="lock-subtitle">
          {stage === "create"
            ? `Hi ${profile?.name?.split(" ")[0] || "there"}! Set a 4-digit PIN to keep this account private.`
            : "Enter the same 4 digits again to confirm."}
        </p>
        {error && <div className="lock-error">{error}</div>}
        <PinPad key={stage} onComplete={handleComplete} shakeTrigger={shakeTrigger} />
      </div>
    </div>
  );
}
