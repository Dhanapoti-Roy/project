const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  type: {
    type: DataTypes.ENUM("group", "private", "command"),
    allowNull: false
  },

  missionId: {
    type: DataTypes.UUID,
    allowNull: true
  },

  participants: {
    type: DataTypes.JSON, // 🔥 array of userIds
    allowNull: false
  }
});

module.exports = Conversation;