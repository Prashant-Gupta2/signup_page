const express = require('express')
const router = express.Router();
const expenseController = require('../controllers/expenseController')
const authMiddleware = require('../middleware/authmiddle')
require('dotenv').config()

router.post('/expense', authMiddleware, expenseController.addExpense)
router.get('/expense', authMiddleware,expenseController.getExpenses)
router.delete('/expense/:id',authMiddleware,expenseController.deleteExpense)

const ai = require("../utils/gemini");

router.get("/verify-key", async (req, res) => {
  const description="donation money"
   const prompt = `
   give relavent categoty based on description,
   Rules:
  - Return ONLY the category name
  - No explanation
  - No extra text

  Expense: ${description}
`;
try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    const reply = response.text;

    res.status(200).json({ response: reply });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      response: 'Something went wrong!'
    });
  }
});

module.exports = router;
