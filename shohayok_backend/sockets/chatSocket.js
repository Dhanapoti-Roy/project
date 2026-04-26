const { Message, Conversation } = require("../models");

const activeMissions = {};
const userLocations = {};

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // 🔹 JOIN ROOM
    socket.on("joinConversation", async (payload) => {
      try {
        const conversationId =
          typeof payload === "string" ? payload : payload?.conversationId;
        const userId = typeof payload === "object" ? payload?.userId : null;

        if (!conversationId) return;

        if (userId) {
          const conversation = await Conversation.findByPk(conversationId);
          if (!conversation) return;

          const participants = Array.isArray(conversation.participants)
            ? conversation.participants
            : [];
          if (!participants.includes(userId)) return;
        }

        socket.join(conversationId);
      } catch (err) {
        console.error("❌ JOIN ERROR:", err);
      }
    });

    // 🔹 SEND MESSAGE
    socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
      try {
        if (!conversationId || !senderId || !String(message || "").trim()) return;

        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) return;

        const participants = Array.isArray(conversation.participants)
          ? conversation.participants
          : [];
        if (!participants.includes(senderId)) return;

        const saved = await Message.create({
          message: String(message).trim(),
          senderId,
          conversationId
        });

        await Conversation.update(
          { updatedAt: new Date() },
          { where: { id: conversationId } }
        );

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
