const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  updateLocation,
  getLatestForUser,
  getMissionLocations,
  stopTracking
} = require("../controllers/locationController");

router.post("/update", authenticate, updateLocation);
router.get("/me", authenticate, getLatestForUser);
router.get("/mission/:missionId", authenticate, authorize("admin", "volunteerHead"), getMissionLocations);
router.post("/stop", authenticate, stopTracking);

module.exports = router;