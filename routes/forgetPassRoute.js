const express = require("express");
const router = express.Router();

const forgetPasswordController = require('../controllers/forgetPasswordController')

router.post("/forget-password", forgetPasswordController.forgotpassword);

router.get("/resetpassword/:id", forgetPasswordController.resetpassword);

router.post("/updatepassword/:resetpasswordid", forgetPasswordController.updatepassword);

module.exports = router;