const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Instruction = sequelize.define("Instruction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // 🔥 type: user / volunteer / alert
  type: {
    type: DataTypes.ENUM("user", "volunteer", "alert"),
    allowNull: false
  },

  // 🔥 optional location based
  district: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 🔥 priority
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "low"
  }

}, {
  tableName: "instructions",
  timestamps: true
});

module.exports = Instruction;