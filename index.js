const express = require('express');
const db = require('./utils/dbConnection');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const signupRoute = require('./routes/signupRoutes')
const signinRoute = require('./routes/loginRoutes')


app.use('/user',signupRoute);
app.use('/user',signinRoute)

db.sync()
.then(()=>{
 app.listen(3000,()=>{
 console.log("Server is running!")
 })
}).catch((err)=>{
 console.log(err)
})
