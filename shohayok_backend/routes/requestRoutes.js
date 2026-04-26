const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createGuestRequest,
  createUserRequest,
  getAllRequests,
  getAcceptedRequests,
  updateRequestStatus
} = require("../controllers/requestController");

// --- Public Routes ---
// গেস্ট ইউজারদের জন্য (লগইন ছাড়া)
// URL: POST http://localhost:5000/requests/guest
router.post("/guest", createGuestRequest);

// --- Protected Routes ---
// রেজিস্টার্ড ইউজারদের জন্য (লগইন করা অবস্থায়)
// URL: POST http://localhost:5000/requests/
router.post("/", authenticate, createUserRequest);

// --- Admin Routes ---
router.get("/", authenticate, authorize("admin"), getAllRequests);
router.get("/accepted", authenticate, authorize("admin"), getAcceptedRequests);
router.patch("/:id/status", authenticate, authorize("admin"), updateRequestStatus);

module.exports = router;