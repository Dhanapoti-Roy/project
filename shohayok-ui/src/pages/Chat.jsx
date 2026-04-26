import "../styles/chat.css";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

export default function Chat({ userId, conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  // =========================
  // 🔥 CONNECT SOCKET
  // =========================
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // =========================
  // 🔥 JOIN ROOM
  // =========================
  useEffect(() => {
    if (!ConversationId) return;

    console.log("JOIN:", conversationId);

    socketRef.current.emit("joinConversation", conversationId);

    socketRef.current.on("receiveMessage", (msg) => {
      console.log("RECEIVED:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.off("receiveMessage");
    };
  }, [conversationId]);

  // =========================
  // 🔥 SEND MESSAGE
  // =========================
  const send = () => {
    if (!input.trim()) return;

    const msgData = {
      conversationId,
      senderId: userId,
      message: input
    };

    console.log("SEND:", msgData);

    socketRef.current.emit("sendMessage", msgData);

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      { ...msgData, id: Date.now(), createdAt: new Date() }
    ]);

    setInput("");
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-root">
      <Navbar />

      <div className="chat-wrap">

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-icon">📡</div>
            <div>
              <div className="chat-title">Live Rescue Chat</div>
              <div className="chat-subtitle">SECURE · REAL-TIME</div>
            </div>
          </div>

          <div className="chat-status-badge">
            <div className="chat-status-dot" />
            <span className="chat-status-text">LIVE</span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-window">
          {messages.map((m) => {
            const isMe = m.senderId === userId;

            return (
              <div key={m.id} className={`msg-row ${isMe ? "me" : ""}`}>
                <div className={`msg-avatar ${isMe ? "me-av" : ""}`}>
                  {isMe ? "You" : "V"}
                </div>

                <div className="msg-body">
                  <div className="msg-name">
                    {isMe ? "You" : "Volunteer"}
                  </div>

                  <div className="msg-bubble">{m.message}</div>

                  <div className="msg-time">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-row">

            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />

            <button className="chat-send" onClick={send}>
              ➤
            </button>

          </div>

          <div className="chat-input-hint">
            Press Enter to send
          </div>
        </div>

      </div>
    </div>
  );
}