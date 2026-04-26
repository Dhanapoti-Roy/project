const Location = require("../models/Location");

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, missionId } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "latitude and longitude required" });
    }

    const location = await Location.create({
      userId: req.user.id,
      role: req.user.role,
      missionId: missionId || null,
      latitude,
      longitude,
      isActive: true,
      recordedAt: new Date()
    });

    return res.status(201).json({ message: "Location updated", location });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update location" });
  }
};

const getLatestForUser = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { userId: req.user.id, isActive: true },
      order: [["recordedAt", "DESC"]]
    });
    return res.json(location || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch location" });
  }
};

const getMissionLocations = async (req, res) => {
  try {
    const { missionId } = req.params;
    const locations = await Location.findAll({
      where: { missionId, isActive: true },
      order: [["recordedAt", "DESC"]]
    });
    return res.json(locations);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch mission locations" });
  }
};

const stopTracking = async (req, res) => {
  try {
    await Location.update(
      { isActive: false },
      { where: { userId: req.user.id, isActive: true } }
    );
    return res.json({ message: "Tracking stopped" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to stop tracking" });
  }
};

module.exports = {
  updateLocation,
  getLatestForUser,
  getMissionLocations,
  stopTracking
};