const express = require("express");
const router = express.Router();
const db = require("../models"); 

router.post("/save-transcript", async (req, res) => {
  try {
    const { title, transcript } = req.body;

    const content = await db.scontents.create({
      title: title,
      body: transcript
    });

    res.json({
      success: true,
      id: content.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

module.exports = router;
