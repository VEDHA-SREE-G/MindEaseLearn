require("dotenv").config();
const express = require('express')
const db = require('./models');
const cors = require('cors')
const quizRoute = require('./routes/quizRoute')
const authRoute = require('./routes/authRoute')

const { getTranscript } = require("./services/transcript");
const { generateNotes } = require("./services/ai");

const app = express();
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173'
}))
app.use("/mindease", quizRoute)
app.use("/mindease", authRoute)

app.post("/generate-notes", async (req, res) => {
  try {
    const { youtubeUrl } = req.body;

    const transcript = await getTranscript(youtubeUrl);

    console.log("Transcript length:", transcript.length);

    if (!transcript || transcript.length < 20) {
    throw new Error("Transcript too short or empty");
    }

    const notes = await generateNotes(transcript);

    res.json({ success: true, notes });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000,()=>{
    console.log("server running on port 3000")
})