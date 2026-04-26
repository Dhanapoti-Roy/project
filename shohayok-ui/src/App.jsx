import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NeedHelp from "./pages/NeedHelp";
import ChatPage from "./pages/ChatPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MapView from "./pages/MapView";
import SubmitReport from "./pages/SubmitReport";
import VolunteerHeadDashboard from "./pages/VolunteerHeadDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddInstruction from "./pages/AddInstruction";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* 🔐 Need Help শুধু user */}
        <Route
          path="/need-help"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <NeedHelp />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Chat (all roles) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "volunteer"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Map (all roles) */}
        <Route
          path="/map"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "volunteer"]}>
              <MapView />
            </ProtectedRoute>
          }
        />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/submit-report" element={<SubmitReport />} />
        <Route path="/admin/instruction" element={<AddInstruction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 🔐 Volunteer Dashboard */}
        <Route
          path="/volunteer-head-dashboard"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerHeadDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;