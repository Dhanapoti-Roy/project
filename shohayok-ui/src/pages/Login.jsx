import "../styles/login.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(""); // 🔥 NEW

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 🔥 clear previous error

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "volunteer") {
          navigate("/volunteer-head-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Try again.";
      setError(msg); // 🔥 show error in UI
    }
  };

  return (
    <div className="login-root">
      <Navbar />

      <div className="login-layout">
        <div className="login-left">
          <p className="left-tag">// RESCUE NETWORK</p>
          <h2 className="left-heading">
            Coordinate.<br />Respond.<br /><span>Save Lives.</span>
          </h2>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="form-heading">Sign In</h2>
             Enter you email address :
            <input
              type="email"
              className="field-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
              Enter your password :
            <input
              className="field-input"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔥 ERROR SHOW */}
            {error && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">
              LOGIN
            </button>

            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#6366f1", fontWeight: "bold" }}>
                Register here
              </Link>
            </p>

            <p style={{ textAlign: "center", marginTop: "10px" }}>
              <a href="/forgot-password" style={{ color: "#6366f1" }}>
                Forgot Password?
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}