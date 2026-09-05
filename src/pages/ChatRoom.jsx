import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { sendMessage, subscribeToMessages } from "../lib/chat";
import { initials } from "../lib/format";

export default function ChatRoom() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    return unsub;
  }, [chatId]);

  useEffect(() => {
    async function loadChatMeta() {
      const snap = await getDoc(doc(db, "chats", chatId));
      if (snap.exists()) {
        const data = snap.data();
        const otherUid = data.members.find((m) => m !== user.uid);
        setOtherUser(data.memberInfo?.[otherUid]);
      }
    }
    loadChatMeta();
  }, [chatId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const toSend = text;
    setText("");
    await sendMessage(chatId, user.uid, toSend);
  }

  return (
    <div className="app-shell">
      <div className="chatroom-header">
        <button className="back-btn" onClick={() => navigate("/chats")}>←</button>
        <div className="avatar">{initials(otherUser?.name)}</div>
        <div>
          <div className="chatroom-header-name">{otherUser?.name || "Loading…"}</div>
          <div className="chatroom-header-status">ChitChat contact</div>
        </div>
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state" style={{ marginTop: 40 }}>
            <div className="empty-state-icon">👋</div>
            <h3>Say hello!</h3>
            <p>This is the start of your conversation with {otherUser?.name}.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`msg-row ${m.senderId === user.uid ? "mine" : "theirs"}`}>
            <div>
              <div className="msg-bubble">{m.text}</div>
              <div className="msg-time">
                {m.createdAt?.toDate
                  ? m.createdAt.toDate().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                  : "sending…"}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={handleSend}>
        <input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!text.trim()}>➤</button>
      </form>
    </div>
  );
}
