const Signup = require('../models/signup')
const bcrypt = require('bcrypt')

const createAccount = async(req,res) =>{
  try{
   const {name,email,password} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Signup.findOne({
      where:{
          email
      }
     });
   const hashPassword = await bcrypt.hash(password,10);

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
   const signedup = await Signup.create({
    name,
    email,
    password:hashPassword
   });

    return res.status(201).json({
     message:'Account created',
     data:signedup     
   })
  }
  catch(err){
   console.error(err)
   return res.status(500).json({Error:'failed to create Account'})
  }
}
module.exports ={createAccount}