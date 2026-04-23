const express = require('express');
const db = require('./utils/dbConnection');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const signupRoute = require('./routes/signupRoutes')
const signinRoute = require('./routes/loginRoutes')
const expenseRoute = require('./routes/expenseRoute')
const path = require('path');
const Expence = require('./models/expense')
const Users = require('./models/signup')


// one to many relation
Users.hasMany(Expence);
Expence.belongsTo(Users);

app.use('/user',signupRoute);
app.use('/user',signinRoute);
app.use('/',expenseRoute);


db.sync()
.then(()=>{
 app.listen(3000,()=>{
 console.log("Server is running!")
 })
}).catch((err)=>{
 console.log(err)
})
