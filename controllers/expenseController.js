const Expense = require('../models/expense');
const sequelize = require('../utils/dbConnection')
const User = require('../models/signup');
const ai = require('../utils/gemini')
const { Op } = require("sequelize");


const addExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;

    if (!amount) {
      await t.rollback();
      return res.status(400).json({ error: 'Amount is required' });
    }
  const prompt = `
   give relavent categoty based on description,
  Rules:
  - Return ONLY the category name
  - No explanation
  - No extra text

  Expense: ${description}
`;
   
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    const ai_category = response.text.trim();

   const cleanAI = ai_category.trim();

   const allowed = ["Food", "Travel", "Fuel", "Shopping", "Bills", "Other"];

   const matched = allowed.find(
      c => c.toLowerCase() === cleanAI.toLowerCase()
    );

    const finalCategory = matched || cleanAI;
    const expense = await Expense.create(
      {
        amount,
        description,
        category:finalCategory,
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


const getExpenseByPage = async (req, res) => {
  const page = Number(req.params.page) || 1;
  const limit = Number(req.params.limit) || 3;

  const offset = (page - 1) * limit;

  const totalItems = await Expense.count({
    where: { userId: req.user.userId }
  });

  const expenses = await Expense.findAll({
    where: { userId: req.user.userId },
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  res.json({
    data: expenses,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit)
  });
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({
      where: {
        id: id,
        userId: req.user.userId,
      }
    },
    {
      transaction:t
    }
  );

    if (!expense) {
      await t.rollback();
      return res.status(404).json({
        message: 'Expense not found!'
      });
    }
    const user = await User.findByPk(req.user.userId,{transaction:t});
    const totalExpense = Number(user.total_expense) - Number(expense.amount)
    await user.update({
      total_expense:totalExpense
    },{
      transaction:t
    }
  )
  await expense.destroy({transaction:t});
  await t.commit();

    return res.status(200).json({
      message: 'Expense deleted!'
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ Error: 'Failed to delete expense' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  getExpenseByPage
};