const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authenticate = require("../middleware/authenticate");
const {
  getMyConversations,
  getConversationMessages
} = require("../controllers/chatController");

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try later" }
});

// test route (minimum)
router.get("/", (req, res) => {
  res.json({ message: "Chat working" });
});

router.get("/conversations", chatRateLimiter, authenticate, getMyConversations);
router.get(
  "/conversations/:conversationId/messages",
  chatRateLimiter,
  authenticate,
  getConversationMessages
);

module.exports = router;
