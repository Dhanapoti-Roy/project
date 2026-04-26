const app = require("./app");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

// 👇 NEW
const http = require("http");
const { Server } = require("socket.io");
const chatSocket = require("./sockets/chatSocket");
const reportRoutes = require("./routes/reportRoutes");
// models load
require("./models");

dotenv.config();

const PORT = process.env.PORT || 5000;

// 👇 create server
const server = http.createServer(app);

// 👇 socket setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  },
  transports: ["websocket", "polling"] 
});

// 👇 initialize socket
chatSocket(io);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    // ❗ app.listen না, server.listen
    server.listen(PORT, () => {
      console.log(`🚀 Shohayok Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();