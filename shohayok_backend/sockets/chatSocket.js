const { Message } = require("../models");

const activeMissions = {};
const userLocations = {};

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // 🔹 JOIN ROOM
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // 🔹 SEND MESSAGE
    socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
      try {
        const saved = await Message.create({
          message,
          senderId,
          ConversationId: conversationId
        });

        io.to(conversationId).emit("receiveMessage", saved);

      } catch (err) {
        console.error("❌ MESSAGE ERROR:", err);
      }
    });

    // 🔹 ON DUTY
    socket.on("on-duty", ({ missionId }) => {
      if (!missionId) return;

      activeMissions[missionId] = true;
      console.log("🚨 ON DUTY:", missionId);
    });

    // 🔹 SEND LOCATION
    socket.on("send-location", (data) => {
      const { userId, lat, lng, missionId, role } = data;

      if (!missionId || !activeMissions[missionId]) return;

      userLocations[userId] = { lat, lng };

      io.emit("receive-location", {
        userId,
        lat,
        lng,
        role,
        missionId
      });
    });

    // 🔹 MISSION COMPLETE
    socket.on("mission-complete", ({ missionId }) => {
      delete activeMissions[missionId];

      io.emit("stop-tracking", { missionId });

      Object.keys(userLocations).forEach((id) => {
        delete userLocations[id];
      });

      console.log("✅ Mission completed:", missionId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;