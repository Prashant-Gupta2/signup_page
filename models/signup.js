const {DataTypes} = require('sequelize')
const db = require('../utils/dbConnection')

const Signup = db.define("Signup",{
  name:{
   type:DataTypes.STRING,
   allowNull:false,
  },
  email:{
   type:DataTypes.STRING,
   allowNull:true,
   unique:true
  },
  password:{
  type:DataTypes.STRING,
  allowNull:false
  }
})

module.exports = Signup;