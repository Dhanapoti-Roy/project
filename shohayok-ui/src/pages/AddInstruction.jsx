import { useState } from "react";
import "../styles/inst.css";

export default function AddInstruction() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "alert",
    district: "",
    priority: "low"
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("error", "Login first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/instructions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized! Login again");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        showToast("error", "Failed to add");
        setLoading(false);
        return;
      }

      showToast("success", "Instruction added!");

      setForm({
        title: "",
        content: "",
        type: "alert",
        district: "",
        priority: "low"
      });

    } catch (err) {
      console.error(err);
      showToast("error", "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="card">

        {/* HEADER */}
        <div className="card-header">
          <div>
            <h2 className="title">Add Instruction</h2>
            <p className="title-sub">ADMIN PANEL</p>
          </div>

          <div className="card-badge">
            <div className="card-badge-dot"></div>
            <span>LIVE</span>
          </div>
        </div>

        {/* TITLE */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            placeholder="Enter title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        {/* CONTENT */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            placeholder="Enter details..."
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />
        </div>

        {/* TYPE + DISTRICT */}
        <div className="row">
          <div className="form-group select-wrap">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="alert">Alert</option>
              <option value="user">User</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <div className="form-group">
            <label>District</label>
            <input
              value={form.district}
              placeholder="Optional"
              onChange={(e) =>
                setForm({ ...form, district: e.target.value })
              }
            />
          </div>
        </div>

        {/* PRIORITY */}
        <div className="form-group">
          <label>Priority</label>
          <div className="priority-row">
            <div
              className={`priority-pill ${
                form.priority === "low" ? "active-low" : ""
              }`}
              onClick={() => setForm({ ...form, priority: "low" })}
            >
              Low
            </div>

            <div
              className={`priority-pill ${
                form.priority === "medium" ? "active-medium" : ""
              }`}
              onClick={() => setForm({ ...form, priority: "medium" })}
            >
              Medium
            </div>

            <div
              className={`priority-pill ${
                form.priority === "high" ? "active-high" : ""
              }`}
              onClick={() => setForm({ ...form, priority: "high" })}
            >
              High
            </div>
          </div>
        </div>

        <div className="form-divider"></div>

        {/* BUTTON */}
        <button
          className={`submit-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit Instruction"}
        </button>
      </div>

      {/* TOAST */}
      <div
        className={`toast ${toast.show ? "show" : ""} ${toast.type}`}
      >
        {toast.message}
      </div>
    </div>
  );
}