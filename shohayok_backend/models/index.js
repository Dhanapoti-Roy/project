const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

module.exports = {
  User,
  Conversation,
  Message,
};