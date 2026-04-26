const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const Report = require("../models/Report");
const Mission = require("../models/Mission");
const Request = require("../models/Request"); 
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { Op } = require("sequelize");
// ==========================
// 🔹 SUBMIT REPORT (MULTIPLE IMAGE)
// ==========================
router.post("/submit", upload.array("images", 5), async (req, res) => {
  try {
    const {
      volunteerId,
      missionId,
      district,
      helpType,
      peopleHelped,
      notes
    } = req.body;

    // 🔥 SINGLE IMAGE FIX
    let imageUrl = null;

    if (req.files && req.files.length > 0) {
      const file = req.files[0];

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "shohayok-reports"
        }
      );

      imageUrl = result.secure_url;
    }

    // 🔥 ANALYTICS CALCULATION
  


const districtName = String(district || "").toLowerCase();
const requests = await Request.findAll({
   where: {
    district: {
      [Op.like]: `%${districtName}%`
    }
  }
});
const totalRequests = requests.length;

    const acceptedRequests = requests.filter(
      (r) => r.status === "approved"
    ).length;

    const totalPeopleRequested = requests.reduce(
      (sum, r) => sum + (r.peopleCount || 0),
      0
    );

    let rescueCount = 0;
    let foodCount = 0;
    let medicineCount = 0;

    requests.forEach((r) => {
      if (r.needType === "rescue") rescueCount += r.peopleCount || 0;
      if (r.needType === "food") foodCount += r.peopleCount || 0;
      if (r.needType === "medicine") medicineCount += r.peopleCount || 0;
    });

    // 🔥 CREATE REPORT
    const report = await Report.create({
      volunteerId,
      missionId,
      district: district,
      helpType,
      peopleHelped: peopleHelped || 0,
      notes,
      image: imageUrl,
      status: "pending",

      totalRequests,
      acceptedRequests,
      totalPeopleRequested,

      rescueCount,
      foodCount,
      medicineCount
    });

    res.json({ message: "Report submitted", report });

  } catch (err) {
    console.error("❌ REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// 🔹 GET ALL REPORTS
// ==========================
router.get("/", async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// ==========================
// 🔹 GET APPROVED REPORTS
// ==========================
router.get("/approved", async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { status: "approved" },
      order: [["createdAt", "DESC"]]
    });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ==========================
// 🔹 APPROVE REPORT
// ==========================
router.patch("/:id/approve", async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    await report.update({ status: "approved" });

    await Mission.update(
      {
        status: "completed",
        endedAt: new Date()
      },
      {
        where: { id: report.missionId }
      }
    );

    res.json({ message: "Approved" });

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ==========================
// 🔹 RETURN REPORT
// ==========================
router.patch("/:id/return", async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    await report.update({ status: "returned" });

    res.json({ message: "Returned" });

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});
// 🔥 DELETE REPORT (ADMIN ONLY)
// middleware/authorize.js already থাকলে use করো
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();

    res.json({ message: "Report deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete report" });
  }
});
module.exports = router;