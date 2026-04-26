const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  conversationId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Message;