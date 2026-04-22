const express = require('express')
const router = express.Router()

const signinController = require('../controllers/signinController')

router.post('/login',signinController.LoginUser);

module.exports = router