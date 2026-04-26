const { Conversation, Message, User } = require("../models");

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversations = await Conversation.findAll({
      order: [["updatedAt", "DESC"]]
    });

    const myConversations = conversations.filter((conversation) => {
      const participants = Array.isArray(conversation.participants)
        ? conversation.participants
        : [];
      return participants.includes(userId);
    });

    const enriched = await Promise.all(
      myConversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          where: { conversationId: conversation.id },
          order: [["createdAt", "DESC"]],
          attributes: ["id", "message", "senderId", "createdAt"]
        });

        return {
          ...conversation.toJSON(),
          lastMessage
        };
      })
    );

    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const participants = Array.isArray(conversation.participants)
      ? conversation.participants
      : [];
    if (!participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "role"]
        }
      ]
    });

    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = {
  getMyConversations,
  getConversationMessages
};
