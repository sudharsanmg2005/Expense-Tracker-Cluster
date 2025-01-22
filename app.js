const mongoose = require('mongoose');
const express = require("express");
const {v4: uuidV4} = require("uuid");
const app = express();
// middleware means An intermediate between the client and the server 
app.use(express.json()); 
mongoose.connect("mongodb+srv://sudharsanmg2023cse:AKRamesh1977@cluster0.rwlm3.mongodb.net/my-cluster-project").then(() => {
    console.log("connected to MongoDB")
})
const expenseSchema =  new mongoose.Schema({
    id:{type: String, required: true, unique: true},
    title:{type: String, required: true},
    amount:{type: Number, required: true}
})
const Expense = mongoose.model("Expense",expenseSchema)

app.post("/api/expenses",async(req,res) => {
    const { title,amount } =req.body
    if(!title||!amount){
        res.status(400).join({message:"Please provide both title and amount"})
    }

    const newExpense = new Expense({
        id : uuidV4(),
        title,
        amount
    })
    // If the key and the value is of same variable to generate an unique id we have unique package
    const savedExpense = await newExpense.save()
    res.status(201).json(savedExpense)

})
app.get("/api/expenses", async(req, res) => {
    try{
    const expenses = await  Expense.find()
    if(!expenses){
        res.status(404).send({message: "Empty Database"})
    }
    res.status(200).json(expenses)
}catch(error){
    res.status(200).json({ message: "Internal Server Error" });
}
})

app.get("/api/expenses/:id", async(req, res) => {
    try{
    const {id} = req.params
    const expense = await Expense.findOne({id})

  if (!expense) {
    res.status(404).json({ message: "Not Found" });
    return;
  }
  res.status(200).json(expense);
}catch(error){
    res.status(200).json({ message: "Internal Server Error" });
}
})
app.delete("/api/expenses/:id", async(req, res) => {
    const {id} = req.params
    try{
    const deletedExpense = await Expense.findOneAndDelete({id})
    if(!deletedExpense){
        res.status(404).json({message: "Expense not Found"})
        return
    }
    res.status(200).json({ message: "Expense deleted successfully" });
}catch(error){
    res.status(200).json({ message: "Internal Server Error" });
}
})

app.put("/api/expenses/:id",async(req,res) => {
    const { id } = req.params
    const { title,amount} = req.body
    try{
        const expenses = await Expense.findOneAndUpdate({id},{
            title,
            amount
        })
        if(!expenses){
            res.status(404).send({ message : "No expenses found with given ID"})
        }else{
            res.status(200).json({message: "Updated sucessfully"})
        }
    }catch(Error){
        res.status(500).json({message: "Internal server error"})
    }
})

app.listen(3000, () => {
  console.log("Server is running")
})




// const expenses = [
//   {
//     id: 1,
//     title: "Food",
//     amount: 2000,
//   },
//   {
//     id: 2,
//     title: "Petrol",
//     amount: 1000,
//   },
//   {
//     id: 3,
//     title: "Service",
//     amount: 3000,
//   },
// ];




// ''


// app.delete("/api/expenses/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = expenses.findIndex((expense) => expense.id === id);
//   if (index === -1) {
//     res.status(404).json({ message: "Not Found" });
//     return;
//   }
//   expenses.splice(index, 1); 
//   res.status(200).json({ message: "Expense deleted successfully" });
// });


// app.put("/api/expenses/:id", (req, res) => {

//     const id = parseInt(req.params.id);
//   const expense = expenses.find((expense) => expense.id == id);
//   if (!expense) {
//     res.status(404).json({ message: "Not Found" });
//     return;
//   }
//   const { title, amount } = req.body;
//   if (title) expense.title = title;
//   if (amount) expense.amount = amount;
//   res.status(200).json({ message: "Expense updated successfully", expense });
// });
