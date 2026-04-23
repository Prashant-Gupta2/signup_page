const express = require('express')
const router = express.Router();
const expenseController = require('../controllers/expenseController')

router.post('/expense',expenseController.addExpense)
router.get('/expense',expenseController.getExpenses)
router.delete('/expense/:id',expenseController.deleteExpense)

module.exports = router
