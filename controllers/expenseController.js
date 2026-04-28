const Expense = require('../models/expense');
const sequelize = require('../utils/dbConnection')
const User = require('../models/signup')

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;

    if (!amount) {
      await t.rollback();
      return res.status(400).json({ error: 'Amount is required' });
    }

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId: req.user.userId,
      },
      { transaction: t }
    );

    const user = await User.findByPk(req.user.userId, { transaction: t });

    const totalExpense = Number(user.total_expense) + Number(amount);

    await user.update(
      { total_expense: totalExpense },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: 'Expense Added!',
      data: expense,
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({
      error: 'Failed to add expense',
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.userId
      }
    });

    if (expenses.length === 0) {
      return res.status(404).json({
        message: 'Expense not found!'
      });
    }

    return res.status(200).json({
      message: 'All Expenses',
      data: expenses
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: 'Failed to fetch expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.destroy({
      where: {
        id: id,
        userId: req.user.userId
      }
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Expense not found!'
      });
    }

    return res.status(200).json({
      message: 'Expense deleted!'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: 'Failed to delete expense' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense
};