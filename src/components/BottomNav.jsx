import { useNavigate, useLocation } from "react-router-dom";

const ITEMS = [
  { key: "chats", path: "/chats", label: "Chats", icon: "💬" },
  { key: "profile", path: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className={`bottom-nav-item ${location.pathname.startsWith(item.path) ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
