import Chat from "../components/Chat";
import { Navigate } from "react-router-dom";

function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userId = user.id;

  // 🔥 later API থেকে আনবা (এখন demo)
  const conversationId = "demo-convo-1";

  return <Chat userId={userId} conversationId={conversationId} />;
}

export default ChatPage;