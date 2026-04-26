import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import socket from "../socket/socket";

function Chat({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/chat/conversations");
        setConversations(data);
        if (data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      try {
        const { data } = await axios.get(
          `/chat/conversations/${activeConversationId}/messages`
        );
        setMessages(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages");
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    socket.emit("joinConversation", {
      conversationId: activeConversationId,
      userId
    });

    const handleIncoming = (incoming) => {
      if (incoming.conversationId !== activeConversationId) return;
      setMessages((prev) => [...prev, incoming]);
    };

    socket.on("receiveMessage", handleIncoming);
    return () => {
      socket.off("receiveMessage", handleIncoming);
    };
  }, [activeConversationId, userId]);

  const sendMessage = () => {
    const clean = message.trim();
    if (!clean || !activeConversationId) return;

    socket.emit("sendMessage", {
      conversationId: activeConversationId,
      senderId: userId,
      message: clean
    });
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Mission Chat</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading chat...</p>}

      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="conversation-select">Conversation: </label>
        <select
          id="conversation-select"
          value={activeConversationId}
          onChange={(e) => setActiveConversationId(e.target.value)}
        >
          {conversations.length === 0 && <option value="">No conversations</option>}
          {conversations.map((conversation) => (
            <option key={conversation.id} value={conversation.id}>
              {conversation.type}
              {conversation.missionId ? ` • ${conversation.missionId.slice(0, 8)}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          height: "320px",
          overflowY: "auto",
          border: "1px solid #ccc",
          marginBottom: "10px",
          padding: "8px"
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "8px" }}>
            <b>
              {msg.senderId === userId
                ? "You"
                : msg.sender?.name || msg.senderId?.slice(0, 8) || "User"}
            </b>
            : {msg.message}
          </div>
        ))}
      </div>

      {activeConversation ? (
        <>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <p>No chat available for your account yet.</p>
      )}
    </div>
  );
}

export default Chat;
