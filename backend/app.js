require("dotenv").config();
const express = require('express')
const db = require('./models');
const cors = require('cors')

const authRoute = require('./routes/authRoute')



const app = express();
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173'
}))

app.use("/mindease", authRoute)
app.use("/api/content", require("./routes/scontentRoute"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
