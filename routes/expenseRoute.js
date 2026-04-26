const express = require('express')
const router = express.Router();
const expenseController = require('../controllers/expenseController')
const authMiddleware = require('../middleware/authmiddle')

router.post('/expense', authMiddleware, expenseController.addExpense)
router.get('/expense', authMiddleware,expenseController.getExpenses)
router.delete('/expense/:id',authMiddleware,expenseController.deleteExpense)

module.exports = router;
