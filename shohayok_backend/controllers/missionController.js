const Mission = require("../models/Mission");
const Location = require("../models/Location");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const startMission = async (req, res) => {
  try {
    const { area } = req.body;
    if (!area) return res.status(400).json({ message: "area required" });

    const mission = await Mission.create({ area, status: "active" });

    // 🔥 get users
    const volunteers = await User.findAll({
      where: { role: "volunteer" }
    });

    const heads = await User.findAll({
      where: { role: "volunteer_head" }
    });

    const admins = await User.findAll({
      where: { role: "admin" }
    });

    const volunteerIds = volunteers.map(u => u.id);
    const headIds = heads.map(u => u.id);
    const adminIds = admins.map(u => u.id);

    // =========================
    // 🔴 GROUP CHAT
    // =========================
    await Conversation.create({
      type: "group",
      missionId: mission.id,
      participants: [...volunteerIds, ...headIds]
    });

    // =========================
    // 🔵 COMMAND CHAT
    // =========================
    await Conversation.create({
      type: "command",
      missionId: mission.id,
      participants: [...adminIds, ...headIds]
    });

    return res.status(201).json({
      message: "Mission started + chats created",
      mission
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to start mission" });
  }
};

const endMission = async (req, res) => {
  try {
    const { id } = req.params;

    const mission = await Mission.findByPk(id);
    if (!mission) return res.status(404).json({ message: "Mission not found" });

    await mission.update({ status: "completed", endedAt: new Date() });

    // ✅ Auto stop tracking for all users in this mission
    await Location.update(
      { isActive: false },
      { where: { missionId: id, isActive: true } }
    );

    return res.json({ message: "Mission ended, tracking stopped", mission });
  } catch (err) {
    return res.status(500).json({ message: "Failed to end mission" });
  }
};

const purgeMissionLocations = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Delete all location history for privacy
    await Location.destroy({ where: { missionId: id } });

    return res.json({ message: "Mission location history deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to purge mission locations" });
  }
};

module.exports = { startMission, endMission, purgeMissionLocations };