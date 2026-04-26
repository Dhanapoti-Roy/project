const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission");

// ==========================
// 🔹 GET ALL MISSIONS (optional)
// ==========================
router.get("/", async (req, res) => {
  try {
    const missions = await Mission.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(missions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch missions" });
  }
});

// ==========================
// 🔥 GET VOLUNTEER MISSIONS (IMPORTANT)
// ==========================
router.get("/:volunteerId", async (req, res) => {
  try {
    const missions = await Mission.findAll({
      where: {
        volunteerHeadId: req.params.volunteerId,
        status: "active"
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(missions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch volunteer missions" });
  }
});

module.exports = router;