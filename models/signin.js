const {DataTypes, DATE} = require('sequelize')

const db = require('../utils/dbConnection')

const Signin = db.define("Signin",{
 email:{
  type:DataTypes.STRING,
  allowNull:false
 },
 password:{
 type:DataTypes.STRING,
 allowNull:false
 },
 date:{
  type:DataTypes.DATE,
  defaultValue:DataTypes.NOW
 }
})
module.exports = Signin;