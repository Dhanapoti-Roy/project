import "../styles/volhead.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const TEAMS = [
  { id: 1, name: "Rescue Team", emoji: "🚁", status: "Active", members: 6, color: "#ef4444", glow: "rgba(239,68,68,0.3)", progress: 80 },
  { id: 2, name: "Food Team", emoji: "🍱", status: "Ready", members: 4, color: "#f59e0b", glow: "rgba(245,158,11,0.3)", progress: 50 },
  { id: 3, name: "Medicine Team", emoji: "💊", status: "Active", members: 5, color: "#3b82f6", glow: "rgba(59,130,246,0.3)", progress: 70 },
];

export default function VolunteerHeadDashboard() {
  const [onDuty, setOnDuty] = useState(false);
  const [mission, setMission] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 FETCH MISSION (FIXED)
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`http://localhost:5000/missions/${user.id}`);
        const data = await res.json();

        if (data.length > 0) {
          setMission(data[0]);
          localStorage.setItem("activeMission", JSON.stringify(data[0]));
        } else {
          setMission(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMission();
  }, []);

  // 🔥 ON DUTY
  const handleDutyToggle = () => {
    const newState = !onDuty;
    setOnDuty(newState);

    if (newState && mission) {
      socket.emit("on-duty", {
        missionId: mission.id
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="vhd-root">
      <Navbar />
      <div className="vhd-container">

        {/* HEADER */}
        <div className="vhd-top">
          <div>
            <p className="vhd-eyebrow">// FIELD COMMAND</p>
            <h2 className="vhd-title">Volunteer Head Dashboard</h2>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              className={`duty-toggle ${onDuty ? "on" : ""}`}
              onClick={handleDutyToggle}
            >
              <div className="duty-dot" />
              <span className="duty-text">ON DUTY</span>
              <span className={`duty-pill ${onDuty ? "on-pill" : "off"}`}>
                {onDuty ? "ACTIVE" : "OFF"}
              </span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* 🔥 MISSION */}
        {mission && (
          <div className="mission-alert">
            <div className="mission-alert-icon">🚨</div>
            <div>
              <p className="mission-alert-label">MISSION ASSIGNED</p>
              <p className="mission-alert-title">
                {mission.area}
              </p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {mission && (
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            
            <button
              className="logout-btn"
              onClick={() => navigate("/submit-report")}
            >
              📋 Submit Report
            </button>

            <button
              className="logout-btn"
              style={{ background: "#ef4444" }}
              onClick={() => {
  setOnDuty(false);

  socket.emit("mission-complete", {
    missionId: mission.id
  });

  setMission(null);

  // 🔥 ADD THIS
  navigate("/submit-report");
}}
            >
              ✅ Complete Mission
            </button>

          </div>
        )}

        {/* MAP */}
        <div className="map-zone">
          <span className="map-badge">LIVE TEAM TRACKING</span>

          {onDuty ? (
            <>
              <div className="map-overlay-label tracking-active">
                GPS TRACKING ACTIVE
              </div>

              <button
                className="logout-btn"
                style={{ marginTop: "15px" }}
                onClick={() => navigate("/map")}
              >
                🗺️ Open Live Map
              </button>
            </>
          ) : (
            <div className="map-overlay-label tracking-inactive">
              TURN ON DUTY TO ENABLE TRACKING
            </div>
          )}
        </div>

        {/* TEAMS */}
        <div className="vhd-grid">
          {TEAMS.map((t) => (
            <div key={t.id} className="team-card">
              <div className="tc-top">
                <div className="tc-emoji">{t.emoji}</div>
                <div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-members">👥 {t.members}</div>
                </div>
                <span className={`tc-status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>

              <div className="tc-bar-bg">
                <div
                  className="tc-bar-fill"
                  style={{
                    width: `${t.progress}%`,
                    background: t.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}