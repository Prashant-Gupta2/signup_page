require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const User = require('../models/signup');
const ForgetPassword = require('../models/forgetPassword');

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist",
        success: false
      });
    }

    const token = uuidv4();

    await ForgetPassword.create({
      userId: user.id,
      token,
      active: true,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    const resetLink = `${process.env.FRONTEND_URL}/password/resetpassword/${token}`;

    const msg = {
      to: user.email,
      from: process.env.SENDER_EMAIL,
      subject: "Password Reset",
      text: `Reset your password: ${resetLink}`,
      html: `
        <div style="font-family: Arial;">
          <h3>Password Reset Request</h3>
          <p>This link is valid for 15 minutes.</p>
          <a href="${resetLink}"
             style="display:inline-block;padding:10px 15px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
        </div>
      `
    };

    await sgMail.send(msg);

    return res.status(200).json({
      message: "Reset link sent to email",
      success: true
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.response?.body || err);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

/* ---------------- RESET PASSWORD PAGE ---------------- */
const resetpassword = async (req, res) => {
  try {
    const {token} = req.params;

    const request = await ForgetPassword.findOne({
      where: {
        token,
        active: true,
         expiresAt: {
           [Op.gt]: new Date()}
      }
    });

    if (!request) {
      return res.status(404).send("Invalid or expired link");
    }

    res.send(`
      <html>
        <body style="font-family:Arial;text-align:center;">
          <h3>Reset Password</h3>
          <form method="post" action="/password/updatepassword/${token}">
            <input 
              name="newpassword" 
              type="password" 
              required 
              placeholder="Enter new password"
            />
            <br/><br/>
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

/* ---------------- UPDATE PASSWORD ---------------- */
const updatepassword = async (req, res) => {
  try {
    const {token }= req.params;
    const { newpassword } = req.body;

    // validation
    if (!newpassword || newpassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false
      });
    }

    const request = await ForgetPassword.findOne({
      where: {
        token,
        active: true,
         expiresAt: {
           [Op.gt]: new Date()}
      }
    });

    if (!request) {
      return res.status(404).json({
        message: "Invalid or expired token",
        success: false
      });
    }

    const user = await User.findOne({ where: { id: request.userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await user.update({ password: hashedPassword });

    // invalidate token (IMPORTANT)
    await request.destroy();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true
    });

  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
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