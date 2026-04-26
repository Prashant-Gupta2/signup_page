const { DataTypes } = require('sequelize');
const db = require('../utils/dbConnection');

const Expense = db.define('Expense', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {  
    type: DataTypes.INTEGER,
    allowNull: false
  }
}
);

module.exports = Expense;