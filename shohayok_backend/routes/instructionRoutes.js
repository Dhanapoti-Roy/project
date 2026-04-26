const express = require("express");
const router = express.Router();
const Instruction = require("../models/Instruction");

// middleware (use your existing)
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


// ==========================
// 🔹 GET ALL (public)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { type, district } = req.query;

    let where = {};

    if (type) where.type = type;

    if (district) {
      where.district = [district, null]; // show general + location
    }

    const data = await Instruction.findAll({
      where,
      order: [["priority", "DESC"], ["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch instructions" });
  }
});


// ==========================
// 🔹 CREATE (ADMIN ONLY)
// ==========================
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { title, content, type, district, priority } = req.body;

    const instruction = await Instruction.create({
      title,
      content,
      type,
      district,
      priority
    });

    res.json(instruction);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create instruction" });
  }
});


// ==========================
// 🔹 DELETE (ADMIN)
// ==========================
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.id);

    if (!instruction) {
      return res.status(404).json({ message: "Not found" });
    }

    await instruction.destroy();

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

module.exports = router;