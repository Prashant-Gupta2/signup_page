
require('dotenv').config();

const express = require('express');
const app = express();

const db = require('./utils/dbConnection');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
// app.use(morgan('combined'));

// ---------- STATIC FILES ----------
app.use(express.static(path.join(__dirname, "view")));

// ---------- HOME ROUTE ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"login.html"))
});

// ---------- MODELS ----------
const Expense = require('./models/expense');
const Signup = require('./models/signup');
const Report = require('./models/report');
const ForgetPassword = require('./models/forgetPassword');

// ---------- ROUTES ----------
const signupRoute = require('./routes/signupRoutes');
const signinRoute = require('./routes/loginRoutes');
const expenseRoute = require('./routes/expenseRoute');
const premimumRoute = require('./routes/premiumRoute');
const forgetPasswordRoute = require('./routes/forgetPassRoute');
const reportDownloadedRoute = require('./routes/reportRoute');

// ---------- RELATIONS ----------
Signup.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(Signup, { foreignKey: 'userId' });

Signup.hasMany(ForgetPassword, { foreignKey: 'userId' });
ForgetPassword.belongsTo(Signup, { foreignKey: 'userId' });

Signup.hasMany(Report, { foreignKey: 'userId' });
Report.belongsTo(Signup, { foreignKey: 'userId' });

// ---------- ROUTE USE ----------
app.use('/user', signupRoute);
app.use('/user', signinRoute);
app.use('/', expenseRoute);
app.use('/premium', premimumRoute);
app.use('/password', forgetPasswordRoute);
app.use('/', reportDownloadedRoute);

// ---------- DB + SERVER START ----------
db.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
      console.log("Server is running!");
    });
  })
  .catch((err) => {
    console.log(err);
  });