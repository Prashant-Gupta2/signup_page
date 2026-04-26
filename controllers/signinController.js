const Signup = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Signup.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User is not registered'
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      "mysecret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login success",
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to login'
    });
  }
};

module.exports = {LoginUser};