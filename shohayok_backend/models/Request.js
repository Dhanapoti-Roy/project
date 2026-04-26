const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    subDistrict: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    village: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    peopleCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    needType: {
      type: DataTypes.ENUM("rescue", "food", "medicine", "shelter"),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "declined"),
       defaultValue: "pending"
        
    }
  },
  {
    tableName: "requests",
    timestamps: true
  }
);

module.exports = Request;