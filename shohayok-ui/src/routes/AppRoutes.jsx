import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MapView from "../pages/MapView";
import Chat from "../pages/Chat";
import NeedHelp from "../pages/NeedHelp";
import ForgotPassword from "../pages/ForgotPassword";
import VolunteerHeadDashboard from "../pages/VolunteerHeadDashboard";
import SubmitReport from "../pages/SubmitReport";
import AdminDashboard from "../pages/AdminDashboard";





export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/need-help" element={<NeedHelp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/volunteer-head" element={<VolunteerHeadDashboard />} />
        <Route path="/submit-report" element={<SubmitReport />} />
        <Route path="/admin" element={<AdminDashboard />} />


      </Routes>
    </BrowserRouter>
  );
}
