import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initials } from "../lib/format";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/chats")}>←</button>
        <h2>Profile</h2>
      </div>

      <div className="profile-header">
        <div className="avatar-lg">{initials(profile?.name)}</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{profile?.name}</div>
        <div style={{ color: "var(--color-text-muted)", fontSize: 13.5, marginTop: 2 }}>
          {profile?.email}
        </div>
      </div>

      <div className="settings-list">
        <div className="settings-row">
          <span className="settings-row-label">About</span>
          <span style={{ color: "var(--color-text-muted)", fontSize: 13.5 }}>
            {profile?.about}
          </span>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Privacy</span>
          <span>›</span>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Notifications</span>
          <span>›</span>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Help & Support</span>
          <span>›</span>
        </div>
        <div className="settings-row" onClick={handleLogout}>
          <span className="settings-row-label settings-row-danger">Log out</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
