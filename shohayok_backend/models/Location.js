const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    missionId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM("user", "volunteer", "admin", "volunteerHead"),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "locations",
    timestamps: true
  }
);

module.exports = Location;