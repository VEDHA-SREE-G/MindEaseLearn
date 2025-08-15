const express = require('express')
const db = require('./models');
const quizRoute = require('./routes/quizRoute')
const app = express();
app.use(express.json())
app.use("/mindease", quizRoute)
app.listen(3000,()=>{
    console.log("server running on port 3000")
})