const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // 🔹 Volunteer Head ID
    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    // 🔹 Mission ID
    missionId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    // 🔹 district (easy access)
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // 🔹 Operation Type (rescue / food / medicine)
    helpType: {
      type: DataTypes.ENUM("rescue", "food", "medicine"),
      allowNull: false
    },

    // 🔹 Total People Helped
    peopleHelped: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // 🔹 Image proof (URL)
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // 🔹 Extra Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // 🔹 Duration (auto calculate later)
    duration: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // 🔹 Status (admin control)
    status: {
      type: DataTypes.ENUM("pending", "approved", "returned"),
      defaultValue: "pending"
    },
    totalRequests: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

acceptedRequests: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

totalPeopleRequested: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

peopleHelped: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

rescueCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

foodCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},

medicineCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
}
  },
  {
    tableName: "reports",
    timestamps: true
  }
  
);

module.exports = Report;