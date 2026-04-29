const express = require('express');
const db = require('./utils/dbConnection');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const path = require('path')
app.use(express.static(path.join(__dirname, "view")));
require('dotenv').config();

const signupRoute = require('./routes/signupRoutes')
const signinRoute = require('./routes/loginRoutes')
const expenseRoute = require('./routes/expenseRoute')
const Expense = require('./models/expense')
const Signup = require('./models/signup')
const ForgetPassword = require('./models/forgetPassword')
const premimumRoute = require('./routes/premiumRoute')
const forgetPasswordRoute = require('./routes/forgetPassRoute')


// one to many relation
Signup.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(Signup, { foreignKey: 'userId' });

//one to many relation
Signup.hasMany(ForgetPassword,{foreignKey:'userId'})
ForgetPassword.belongsTo(Signup,{foreignKey:'userId'})

app.use('/user',signupRoute);
app.use('/user',signinRoute);
app.use('/',expenseRoute);
app.use('/premium',premimumRoute);
app.use('/password',forgetPasswordRoute);

db.sync()
.then(()=>{
 app.listen(3000,()=>{
 console.log("Server is running!")
 })
}).catch((err)=>{
 console.log(err)
})
