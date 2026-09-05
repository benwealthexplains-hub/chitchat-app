import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeToUserChats } from "../lib/chat";
import { initials, formatTime } from "../lib/format";
import BottomNav from "../components/BottomNav";

export default function ChatsList() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserChats(user.uid, (list) => {
      setChats(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  function otherMember(chat) {
    const otherUid = chat.members.find((m) => m !== user.uid);
    return chat.memberInfo?.[otherUid] || { name: "Unknown" };
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <h1>Chats</h1>
          <div className="status-line">
            <span className="status-dot" />
            Stay connected, always
          </div>
        </div>
        <div className="avatar" onClick={() => navigate("/profile")}>
          {initials(profile?.name)}
        </div>
      </div>

      <div className="search-bar" onClick={() => navigate("/new-chat")}>
        🔍 Search or start a new chat…
      </div>

      {loading ? (
        <div className="center-loader">Loading chats…</div>
      ) : chats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3>No chats yet</h3>
          <p>Tap the button below to start your first conversation.</p>
        </div>
      ) : (
        <div className="chat-list">
          {chats.map((chat) => {
            const other = otherMember(chat);
            const isMine = chat.lastSender === user.uid;
            return (
              <div
                key={chat.id}
                className="chat-row"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="avatar">{initials(other.name)}</div>
                <div className="chat-row-content">
                  <div className="chat-row-top">
                    <span className="chat-row-name">{other.name}</span>
                    <span className="chat-row-time">{formatTime(chat.updatedAt)}</span>
                  </div>
                  <div className="chat-row-preview">
                    {chat.lastMessage
                      ? `${isMine ? "You: " : ""}${chat.lastMessage}`
                      : "Say hello 👋"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="fab" onClick={() => navigate("/new-chat")}>
        +
      </button>

      <BottomNav />
    </div>
  );
}
