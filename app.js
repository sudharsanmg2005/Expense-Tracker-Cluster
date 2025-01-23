const express = require('express')
//http methods GET,POST,DELETE,PUT/PATCH
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const { v4: uuidv4 } = require("uuid")
mongoose.connect("mongodb+srv://sudharsanmg2023cse:AKRamesh1977@cluster0.rwlm3.mongodb.net/my-cluster-project").then(() => {
    console.log("Connected to MongoDB")
})

const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: String, required: true }
})
const Expense = mongoose.model("Expense", expenseSchema)




// const expenses = [
//     {
//         id: 1,
//         title: "Food",
//         amount: 200
//     }, {
//         id: 2,
//         title: "Truf",
//         amount: 500
//     }, {
//         id: 3,
//         title: "Camer",
//         amount: 300
//     }, {
//         id: 4,
//         title: "Phone",
//         amount: 5000
//     }
// ]

// app.get('/api/expenses', async(req, res) => {
//     const expenses = await Expense.find()
//     if(!expenses){
//         res.status(404).send({message:"No expenses found"})
//     }
//     res.status(200).json(expenses)
// })

app.get('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOne({ id: id })
        if (!expense) {
            res.status(404).json({ message: "Not Found" })
        }
        res.status(200).json(expense)
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
    }
})

// app.get('/api/expenses/:id',( (req,res) =>{
//     const {id} = req.params
//     const exp = expenses.filter( expense => expense.id < id)
//     if(exp.length==0){
//         res.status(404).json({message: "Not Found"})
//     }
//     res.status(200).json(exp)
// }))

app.post('/api/expenses', async (req, res) => {
    try {
        const { title, amount } = req.body
        if (!title || !amount) {
            res.status(400).json({ message: "Please provide both title and amount" })
        }
        const newExpense = new Expense({
            id: uuidv4(),
            title, //Equals to title:title
            amount
        })
        const savedExpense = await newExpense.save()
        res.status(201).json(savedExpense)
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
    }
})

app.delete('/api/expenses/:id', async(req,res) => {
    const {id}=req.params
    try {
        const deletedExpense = await Expense.findOneAndDelete({id})
        if(!deletedExpense){
            res.status(200).json({message: "Expense not found"})
        }
        res.status(200).json({message: "Deleted Successfully"})
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
    }
})
app.put('/api/expenses/:id',async(req,res)=>{
    const {id} = req.params
    const {title,amount}=req.body
    try{
        if(!title && !amount){
            res.status(200).json({message : "No Value Provided for Update"})
            return
        }
        const updatedExpense = await Expense.findOneAndUpdate({id},{$set:{title,amount}},{new:true})
        if(!updatedExpense){
            res.status(201).json({message: "Expense not found"})
            return
        }
        res.status(200).json({message: "Updated Successfully"})
    }
    catch(error){
        res.status(400).json({ message: "Internal Server Error" })
    }
})
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "Empty Database" });
    }
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
    console.log("Server is running")
})
