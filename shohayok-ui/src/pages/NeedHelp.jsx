import "../styles/help.css";
import Navbar from "../components/Navbar";
import { useState } from "react";
import axios from "../api/axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});


export default function NeedHelp() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    subDistrict: "",
    village: "",
    trapped: "",
    need: "rescue"
  });
const DISTRICTS = [
  "Dhaka",
  "Rangpur",
  "Chittagong",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rajshahi",
  "Mymensingh"
];

const SUB_DISTRICTS = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara"],
  Rangpur: ["Pirganj", "Badarganj", "Nilphamary"],
  Chittagong: ["Pahartali", "Sitakunda"],
  Khulna: ["Sonadanga", "Batiaghata"],
  Barisal: ["Agailjhara"],
  Sylhet: ["Beanibazar"],
  Rajshahi: ["Godagari"],
  Mymensingh: ["Trishal"]
};
  const [message, setMessage] = useState("");

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // 🔥 FIX

      // 🔥 LOGGED USER (token check)
      if (token) {
        await axios.post("/requests", {
          trapped: form.trapped,
          need: form.need,
          district: form.district,
          subDistrict: form.subDistrict,
          village: form.village
        });

      } 
      // 🔥 GUEST USER
      else {
        await axios.post("/requests/guest", {
          name: form.name,
          phone: form.phone,
          district: form.district,
          subDistrict: form.subDistrict,
          village: form.village,
          trapped: form.trapped,
          need: form.need
        });
      }

      setMessage("Request submitted successfully ✅");

      setForm({
        name: "",
        phone: "",
        district: "",
        subDistrict: "",
        village: "",
        trapped: "",
        need: "rescue"
      });

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to submit ❌"
      );
    }
  };

  return (
    <div className="nh-root">
      <Navbar />

      <div className="nh-center">
        <form className="nh-card" onSubmit={handleSubmit}>
          
          {/* 🔥 CARD HEADER */}
          <div className="nh-card-top">
            <div className="nh-eyebrow">EMERGENCY RESPONSE</div>
            <h2 className="nh-title">Need Help</h2>
            <div className="nh-sub">Submit your details to request immediate assistance.</div>
          </div>

          {/* 🔥 CARD BODY (FORM FIELDS) */}
          <div className="nh-body">
            
            {/* 🔥 MESSAGE */}
            {message && (
              <div style={{
                textAlign: "center",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                background: message.includes("❌") ? "rgba(220,38,38,0.1)" : "rgba(34,197,94,0.1)",
                border: `1px solid ${message.includes("❌") ? "rgba(220,38,38,0.2)" : "rgba(34,197,94,0.2)"}`,
                color: message.includes("❌") ? "#ef4444" : "#4ade80",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "13px"
              }}>
                {message}
              </div>
            )}

            {/* 🔥 GUEST FIELDS */}
            {!localStorage.getItem("token") && (
              <div className="field-section">
                <div className="field-section-title">Contact Info</div>
                <div className="input-grid">
                  <div>
                    <label className="nh-label">FULL NAME</label>
                    <input
                      className="nh-input"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                  </div>
                  <div>
                    <label className="nh-label">PHONE NUMBER</label>
                    <input
                      className="nh-input"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={set("phone")}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 LOCATION FIELDS */}
            <div className="field-section">
              <div className="field-section-title">Location Details</div>
              <div className="input-grid">
                <div>
                  <label className="nh-label">DISTRICT</label>
                  <select
  className="nh-input"
  value={form.district}
  onChange={set("district")}
>
  <option value="">Select District</option>
  {DISTRICTS.map((d) => (
    <option key={d} value={d}>
      {d}
    </option>
  ))}
</select>
                </div>
                <div>
                  <label className="nh-label">SUB-DISTRICT</label>
                  <select
            className="nh-input"
            value={form.subDistrict}
            onChange={set("subDistrict")}
            disabled={!form.district}
          >
            <option value="">Select Sub-District</option>
            {SUB_DISTRICTS[form.district]?.map((sd) => (
              <option key={sd} value={sd}>
                {sd}
              </option>
            ))}
          </select>
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <label className="nh-label">VILLAGE / EXACT AREA</label>
                <input
                  className="nh-input"
                  placeholder="Village"
                  value={form.village}
                  onChange={set("village")}
                  required
                />
              </div>
            </div>

            {/* 🔥 EMERGENCY DETAILS */}
            <div className="field-section">
              <div className="field-section-title">Emergency Info</div>
              <div className="input-grid">
                <div>
                  <label className="nh-label">PEOPLE TRAPPED</label>
                  <input
                    className="nh-input"
                    type="number"
                    placeholder="Number"
                    value={form.trapped}
                    onChange={set("trapped")}
                    required
                  />
                </div>
                <div>
                  <label className="nh-label">PRIMARY NEED</label>
                  <select
                    className="nh-select"
                    value={form.need}
                    onChange={set("need")}
                  >
                    <option value="rescue">Rescue</option>
                    <option value="food">Food</option>
                    <option value="medicine">Medicine</option>
                    <option value="shelter">Shelter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 🔥 SUBMIT BUTTON (Updated to match CSS class 'nh-submit') */}
            <button type="submit" className="nh-submit">
              SUBMIT REQUEST
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}