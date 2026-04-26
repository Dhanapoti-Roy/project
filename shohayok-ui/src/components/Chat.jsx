import { useEffect, useState } from "react";
import socket from "../socket/socket";

function Chat({ userId, roomId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // join room
    socket.emit("join_room", roomId);

    // receive message
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      roomId,
      senderId: userId,
      message,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Chat</h3>

      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.senderId}</b>: {msg.message}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;