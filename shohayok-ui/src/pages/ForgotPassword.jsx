import "../styles/forgot.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [otpSent, setOtpSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState(""); // 🔥 NEW

  // 🔥 SEND OTP
  const handleSendOtp = async () => {
    try {
      setMessage(""); // clear
      await axios.post("/auth/forgot-password", { email });

      setOtpSent(true);
      setMessage("OTP has been sent to your email ✅"); // 🔥 show in UI

    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP ❌");
    }
  };

  // 🔥 RESET PASSWORD
  const handleReset = async () => {
    try {
      setMessage("");

      await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword: newPass
      });

      setResetDone(true);

    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed ❌");
    }
  };

  return (
    <div className="fp-root">
      <Navbar />
      <div className="fp-center">
        <div className="fp-card">

          {resetDone ? (
            <div className="fp-success">
              <div className="fp-success-icon">✅</div>
              <div className="fp-success-title">Password Reset!</div>
              <div className="fp-success-sub">
                You can now log in with your new password.
              </div>
              <button
                className="fp-btn green"
                style={{ marginTop: 24 }}
                onClick={() => (window.location.href = "/login")}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <div className="fp-icon">🔐</div>
              <p className="fp-tag">Account Recovery</p>
              <h2 className="fp-heading">Forgot Password</h2>

              {/* 🔥 MESSAGE SHOW */}
              {message && (
                <p style={{
                  textAlign: "center",
                  color: message.includes("❌") ? "red" : "green",
                  marginBottom: "10px"
                }}>
                  {message}
                </p>
              )}

              <div className="fp-steps">
                <div className={`fp-step ${!otpSent ? "active" : "done"}`} />
                <div className={`fp-step ${otpSent ? "active" : ""}`} />
              </div>

              {!otpSent ? (
                <>
                  <p className="fp-sub">
                    Enter your registered email and we'll send you a verification code.
                  </p>

                  <label className="fp-label">EMAIL ADDRESS</label>
                  <input
                    className="fp-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button className="fp-btn" onClick={handleSendOtp}>
                    Send OTP →
                  </button>
                </>
              ) : (
                <>
                  <p className="fp-sub">
                    Enter the OTP sent to{" "}
                    <strong style={{ color: "#818cf8" }}>
                      {email}
                    </strong>
                  </p>

                  <label className="fp-label">VERIFICATION CODE</label>
                  <input
                    className="fp-input"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <label className="fp-label">NEW PASSWORD</label>
                  <input
                    className="fp-input"
                    type="password"
                    placeholder="New password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />

                  <button className="fp-btn green" onClick={handleReset}>
                    Reset Password ✓
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}