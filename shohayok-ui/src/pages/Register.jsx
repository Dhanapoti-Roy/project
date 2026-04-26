import "../styles/register.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", district: "", email: "", password: "", role: "" });
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const mapRole = (r) => {
    if (r === "volunteer") return "volunteer";
    return "user"; // victim/medic/donor -> user
  };

  const handleRegister = async () => {
    setError("");
    setError("");
    try {
      await authApi.register({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: mapRole(form.role)
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <>
      

      <div className="reg-root">
        <Navbar />
        <div className="reg-layout">
          <div className="reg-card">
            <div className="reg-header">
              <div className="reg-icon">🛡</div>
              <div>
                <p className="reg-eyebrow">JOIN THE NETWORK</p>
                <h2 className="reg-title">Create Account</h2>
              </div>
            </div>

            {/* Progress */}
            <div className="reg-progress">
              <div className="prog-step">
                <div className={`prog-circle ${step > 1 ? "done" : "active"}`}>{step > 1 ? "✓" : "1"}</div>
                <span className="prog-label">PERSONAL</span>
              </div>
              <div className={`prog-line ${step > 1 ? "filled" : ""}`} />
              <div className="prog-step">
                <div className={`prog-circle ${step === 2 ? "active" : "idle"}`}>2</div>
                <span className="prog-label">ROLE</span>
              </div>
            </div>

            <div className="reg-body">
              {step === 1 && (
                <>
                  <label className="reg-label">FULL NAME</label>
                  <input className="reg-input" placeholder="Your full name" value={form.name} onChange={set("name")} />

                  <label className="reg-label">PHONE NUMBER</label>
                  <input className="reg-input" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} />

                  <label className="reg-label">DISTRICT</label>
                  <input className="reg-input" placeholder="e.g. Sylhet" value={form.district} onChange={set("district")} />

                  <label className="reg-label">EMAIL ADDRESS</label>
                  <input className="reg-input" placeholder="you@example.com" value={form.email} onChange={set("email")} />

                  <label className="reg-label">PASSWORD</label>
                  <div className="pass-wrap">
                    <input className="reg-input" placeholder="Create password" type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} />
                    <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                  </div>

                  <div className="reg-actions">
                    <button className="btn-next" onClick={() => setStep(2)}>Next →</button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="reg-label">SELECT YOUR ROLE</label>
                  <div className="role-grid">
                    {[
                      { key: "victim", emoji: "🆘", name: "Affected Person", desc: "Need rescue or relief" },
                      { key: "volunteer", emoji: "🤝", name: "Volunteer", desc: "Provide rescue help" },
                      { key: "medic", emoji: "🏥", name: "Medic", desc: "Medical support" },
                      { key: "donor", emoji: "📦", name: "Donor", desc: "Donate resources" },
                    ].map((r) => (
                      <div
                        key={r.key}
                        className={`role-card ${form.role === r.key ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, role: r.key })}
                      >
                        <div className="role-emoji">{r.emoji}</div>
                        <div className="role-name">{r.name}</div>
                        <div className="role-desc">{r.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="reg-actions">
                    <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-next" onClick={handleRegister}>Create Account ✓</button>
                  </div>
                </>
              )}

              {error && (
                <div style={{ color: "#ef4444", marginTop: 10, textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }}>
                  {error}
                </div>
              )}
              <p className="login-hint">
                Already have an account? <Link to="/login">Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
