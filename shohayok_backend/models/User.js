const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("admin", "volunteer", "user"),
      defaultValue: "user"
    },

    // 🔥 ADD THIS (CORRECT WAY)
    district: {
      type: DataTypes.STRING,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    refreshTokenHash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    refreshTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },

    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

module.exports = User;