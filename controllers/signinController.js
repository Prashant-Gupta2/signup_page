const { bytes } = require('node:stream/consumers');
const Signin = require('../models/signin')
const Signup = require('../models/signup')
const bcrypt = require('bcrypt')
const path   = require('path')
const jwt = require('jsonwebtoken')


function getToken(user){
  return jwt.sign({id:user.id,email:user.email}, "mysecret")
}
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
   const token = getToken(user);

    return res.status(200).json({
      message:'Login success',
      token: token
    })

   
  }
 catch(err){
  console.error(err)
  return res.status(500).json({Error:'Failed to login'})
 }
}

module.exports ={LoginUser};