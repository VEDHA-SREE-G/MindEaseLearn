const express = require('express');
const router = express.Router();
const {generateQuiz} = require('../controllers/quizController')
router.get('/generate-quiz/:id',generateQuiz);
module.exports = router;