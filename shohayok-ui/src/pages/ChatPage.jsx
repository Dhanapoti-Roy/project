import Chat from "../components/Chat";
import { Navigate } from "react-router-dom";

function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Chat userId={user.id} />;
}

export default ChatPage;
