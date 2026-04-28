const Signup = require('../models/signup')
const Expense = require('../models/expense')
const {Sequelize} = require('sequelize')

const getPremium = async (req, res) => {
  try {
    const result = await Signup.findAll({
      attributes: ["id", "name", "total_expense"],
      order: [["total_expense", "DESC"]],
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: 'No users found',
      });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to fetch premium users',
    });
  }
};
module.exports ={getPremium};