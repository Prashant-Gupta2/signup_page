require("dotenv").config();
const axios = require("axios");

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const resetLink = `http://localhost:3000/forgetPass.html?email=${email}`;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "My App",
          email: process.env.SENDER_EMAIL
        },
        to: [{ email }],
        subject: "Reset Password",
        htmlContent: `
          <h3>Password Reset</h3> 
          <p>Click below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return res.send("Reset link sent to email");
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ Error: "Unable to reset password" });
  }
};

module.exports = { forgetPassword };