const Signup = require('../models/signup')
const Expense = require('../models/expense')
const {Sequelize} = require('sequelize')

const getPremium = async(req,res) =>{
 try{
 const result = await Expense.findAll({
  attributes: [
    [Sequelize.col("Signup.name"), "name"],
    [Sequelize.fn("SUM", Sequelize.col("amount")), "total_expenses"],
  ],
  include: [
    {
      model: Signup,
      attributes: [],
    },
  ],
  group: ["Signup.id", "Signup.name"],
  order: [[Sequelize.literal("total_expenses"), "DESC"]],
});
if(!result){
 return res.status(404).json({message:'premium not found'})
}
 return res.status(200).json(result)
 }
 catch(err){
 console.error(err)
 return res.status(500).json({Error:'Failed to fetch premimum'})
 }
}
module.exports ={getPremium};