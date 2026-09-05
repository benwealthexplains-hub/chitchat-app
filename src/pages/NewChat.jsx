import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrGetChat, getAllUsers } from "../lib/chat";
import { initials } from "../lib/format";

export default function NewChat() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [startingChatId, setStartingChatId] = useState(null);

  useEffect(() => {
    getAllUsers(user.uid).then((list) => {
      setUsers(list);
      setLoading(false);
    });
  }, [user]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function startChat(otherUser) {
    setStartingChatId(otherUser.uid);
    const currentUser = { uid: user.uid, name: profile?.name, email: profile?.email };
    const chatId = await createOrGetChat(currentUser, otherUser);
    navigate(`/chat/${chatId}`);
  }

  return (
    <div className="app-shell">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>New Chat</h2>
      </div>

      <div className="search-bar" style={{ margin: "16px 20px" }}>
        🔍
        <input
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            flex: 1,
            font: "inherit",
            color: "inherit",
          }}
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="center-loader">Loading contacts…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No one here yet</h3>
          <p>Once your other testers sign up, they'll show up here.</p>
        </div>
      ) : (
        <div className="chat-list">
          {filtered.map((u) => (
            <div
              key={u.uid}
              className="contact-row"
              onClick={() => startChat(u)}
            >
              <div className="avatar">{initials(u.name)}</div>
              <div>
                <div className="contact-name">{u.name}</div>
                <div className="contact-email">
                  {startingChatId === u.uid ? "Starting chat…" : u.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
