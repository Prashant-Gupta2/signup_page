const { DataTypes } = require('sequelize');
const db = require('../utils/dbConnection');

const Signup = db.define('Signup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,   
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
);

module.exports = Signup;