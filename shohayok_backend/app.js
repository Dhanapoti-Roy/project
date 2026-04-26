const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database"); // এটি আপনার Sequelize instance

dotenv.config();

const app = express();

// --- Security / Core Middleware ---
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/instructions", require("./routes/instructionRoutes"));
// --- DB Connection Check (Sequelize Style) ---
// Sequelize-এ কানেকশন চেক করার সঠিক পদ্ধতি হলো .authenticate()
db.authenticate()
  .then(() => {
    console.log("✅ Shohayok Database Connected Successfully (via Sequelize)");
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:", err.message);
  });

// --- Health Check ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- Routes ---
// নিশ্চিত করুন এই ফাইলগুলো আপনার 'routes' ফোল্ডারে আছে
app.use("/auth", require("./routes/authRoutes")); 
app.use("/requests", require("./routes/requestRoutes"));
app.use("/locations", require("./routes/locationRoutes"));
app.use("/missions", require("./routes/missionRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/chat", require("./routes/chatRoutes"));

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("Error Log:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

module.exports = app;