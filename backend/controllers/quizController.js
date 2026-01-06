const {scontents : Scontent} = require('../models')
const openai = require('../config/openai.config')
exports.generateQuiz = async (req, res) => {
    try{
        const content = await Scontent.findByPk(req.params.id);
        if(!content){
            return res.status(404).json({error: "Content Not Found"});
        }
        const prompt = `You are a quiz generator.  
Based on the following text, create exactly 5 multiple-choice questions.  
Each question should have 4 options and exactly 1 correct answer.  

Return the result strictly as JSON in this format:  
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string"
  }
]

Do not include any text outside of the JSON.
Text:
    ${content.body}`
    const response = await openai.chat.completions.create({
        model : "gpt-4o-mini",
        messages : [{role: "user", content:prompt}],
        temperature : 0.7
    })
    const quizData = response.choices[0].message.content;
    res.json({quiz: JSON.parse(quizData)})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Quiz Generation Failed"})
    }
}