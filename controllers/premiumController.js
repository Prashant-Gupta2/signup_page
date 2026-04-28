const Signup = require('../models/signup')
const Expense = require('../models/expense')
const {Sequelize} = require('sequelize')

const getPremium = async(req,res) =>{
 try{
const result = await Signup.findAll({
  attributes: [
    "id",
    "name",
    [Sequelize.fn("SUM", Sequelize.col("Expenses.amount")), "total_expenses"],
  ],
  include: [
    {
      model: Expense,
      attributes: [],
      required: false,
    },
  ],
  group: ["Signup.id"],
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