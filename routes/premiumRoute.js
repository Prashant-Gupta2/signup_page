const express = require('express')
const router = express.Router()
const premimumController = require('../controllers/premiumController')

router.get("/show-leaderboard",premimumController.getPremium);

module.exports = router;

