const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getMyConversations,
  getConversationMessages
} = require("../controllers/chatController");

// test route (minimum)
router.get("/", (req, res) => {
  res.json({ message: "Chat working" });
});

router.get("/conversations", authenticate, getMyConversations);
router.get(
  "/conversations/:conversationId/messages",
  authenticate,
  getConversationMessages
);

module.exports = router;
