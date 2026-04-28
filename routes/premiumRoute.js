const express = require('express')
const router = express.Router()
const premimumController = require('../controllers/premiumController')
const authMiddleware = require('../middleware/authmiddle')

router.get("/show-leaderboard",authMiddleware, premimumController.getPremium);

module.exports = router;

