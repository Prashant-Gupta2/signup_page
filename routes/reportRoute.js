const express = require('express')
const authMiddleware = require('../middleware/authmiddle')

const router = express.Router();
const reportDownloadedController = require('../controllers/reportDownloadController')

router.post('/expense/download',authMiddleware,reportDownloadedController.reportDownloadedList);

module.exports = router;