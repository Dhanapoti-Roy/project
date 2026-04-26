import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">Shohayok</h1>

      <div className="space-x-4">

        {/* COMMON */}
        <Link to="/">Home</Link>
        <Link to="/map">Map</Link>
        <Link to="/chat">Chat</Link>

        {/* USER only */}
        {user?.role === "user" && (
          <Link to="/need-help">Need Help</Link>
        )}

        {/* VOLUNTEER */}
        {user?.role === "volunteerHead" && (
          <Link to="/volunteer-head-dashboard">Dashboard</Link>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <Link to="/admin">Dashboard</Link>
        )}

        {/* LOGIN / LOGOUT */}
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}

      </div>
    </div>
  );
}