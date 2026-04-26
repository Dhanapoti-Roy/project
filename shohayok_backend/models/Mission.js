const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mission = sequelize.define(
  "Mission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    area: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("active", "completed"),
      defaultValue: "active"
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    volunteerHeadId: {
  type: DataTypes.UUID,
  allowNull: true
}
  },
  {
    tableName: "missions",
    timestamps: true
  }
);

module.exports = Mission;