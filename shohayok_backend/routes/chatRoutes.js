const express = require("express");
const router = express.Router();

// test route (minimum)
router.get("/", (req, res) => {
  res.json({ message: "Chat working" });
});

module.exports = router; 