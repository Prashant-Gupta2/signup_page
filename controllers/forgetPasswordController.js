require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/signup');
const ForgetPassword = require('../models/forgetPassword');

// SET SENDGRID KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist", success: false });
    }

    const token = uuidv4();

    await ForgetPassword.create({
      userId: user.id,
      token: token
    });

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: "Password Reset",
      text: `Reset your password: ${process.env.FRONTEND_URL}/password/resetpassword/${token}`,
      html: `
        <div style="font-family: Arial;">
          <h3>Password Reset Request</h3>
          <p>Click below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL}/password/resetpassword/${token}"
             style="display:inline-block;padding:10px 15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
        </div>
      `
    };

    await sgMail.send(msg);

    return res.status(200).json({
      message: "Link sent to your email",
      success: true
    });

  } catch (err) {
    console.error("ERROR:", err.response?.body || err);
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

const resetpassword = async (req, res) => {
  try {
    const token = req.params.id;

    const request = await ForgetPassword.findOne({
      where: { token, active: true }
    });

    if (!request) {
      return res.status(404).send("Invalid or expired link");
    }

    res.send(`
      <html>
        <body>
          <h3>Reset Password</h3>
          <form action="/password/updatepassword/${token}" method="post">
            <input name="newpassword" type="password" required />
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);

  } catch (error) {
    return res.status(500).send("Error");
  }
};

const updatepassword = async (req, res) => {
  try {
    const token = req.params.resetpasswordid;
    const { newpassword } = req.body;

    const request = await ForgetPassword.findOne({
      where: { token, active: true }
    });

    if (!request) {
      return res.status(404).json({ message: "Invalid token", success: false });
    }

    const user = await User.findOne({ where: { id: request.userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    await user.update({ password: hashedPassword });

    await request.update({ active: false });

    return res.status(200).json({
      message: "Password updated successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
};

module.exports = {
  forgotpassword,
  resetpassword,
  updatepassword
};