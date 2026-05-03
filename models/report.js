const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");

const Report = sequelize.define("Report", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  url: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Report;