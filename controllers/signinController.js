const { bytes } = require('node:stream/consumers');
const Signin = require('../models/signin')
const Signup = require('../models/signup')
const bcrypt = require('bcrypt')

const LoginUser = async(req,res)=>{
 try{
  const {email,password} = req.body;
  const user = await Signup.findOne({
   where:{
    email:email
   }
  });
  
  if(!user){
  return res.status(404).json({
  message:'User is not registered'
  })
  }
  let checkPassword = await bcrypt.compare(password,user.password)
  
   if(!checkPassword){
    return res.status(404).json({
     message:'Password is incorrect'
    })
   }
   else{  
    const loggedinUser = await Signin.create({
    email:email,
    password:user.password
  })
  res.status(200).json({
   message:'Login success',
   data:loggedinUser
  })
   } 
  }
 catch(err){
  console.error(err)
  return res.status(500).json({Error:'Failed to login'})
 }
}

module.exports ={LoginUser};