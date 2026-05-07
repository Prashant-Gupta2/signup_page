const express = require("express");
const router = express.Router();

const forgetPasswordController = require("../controllers/forgetPasswordController");

router.post("/forget-password", forgetPasswordController.forgotpassword);

router.get("/resetpassword/:token", forgetPasswordController.resetpassword);

router.post("/updatepassword/:token", forgetPasswordController.updatepassword);

module.exports = router;