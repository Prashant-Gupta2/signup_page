const Expense = require('../models/expense')

const addExpense = async (req,res) =>{
  try{
   const {amount,description,category} = req.body;
   const expense = await Expense.create({
     amount,
     description,
     category
   })
   return res.status(201).json({
   message:'Expence Added!',
   data:expense
   });
  }
  catch(err){
  console.error(err)
  res.status(500).json({Error:'Failed to add expense'})
  }
}
const getExpenses = async (req,res) =>{
 try{
 const expenses = await Expense.findAll();
 if(expenses.length === 0){
  return res.status(404).json({
  message:'Expense not found!'
  })
 }
 return res.status(200).json({
  message:'All Expences',
  data:expenses
 })
 }
 catch(err){
  console.error(err)
  res.status(500).json({Error:'Failed to fetch expense'})    
 }
}
const deleteExpense = async(req,res) =>{
  try{
   const {id} = req.params;
   const deleteexpense = await Expense.destroy({
    where:{
      id:id
    }
   })
   if(!deleteExpense){
    return res.status(404).json({
     message:'expense not found!'
    })
   }
   return res.status(200).json({message:'Expense deleted!'})
  }
   catch(err){
  console.error(err)
  res.status(500).json({Error:'Failed to delete expense'})    
 }
}
module.exports = {addExpense,getExpenses,deleteExpense};