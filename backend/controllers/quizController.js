const Quiz = require('../models/quizModel');
const multer = require('multer');
const pdf = require('pdf-parse');
const { getQuizFromAI} = require('../services/generativeAIService');


exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user._id, 
    });
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
};
exports.scoreQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; 
    console.log(quizId)

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;

  
    for (let i = 0; i < answers.length; i++) {
      const { questionId, answerId } = answers[i];

     
      const question = quiz.questions.find(q => q._id.toString() === questionId);

      if (question) {
     
        const selectedAnswer = question.answers.find(a => a._id.toString() === answerId);

  
        if (selectedAnswer && selectedAnswer.isCorrect) {
          score++;
        }
      }
    }


    const userHistory = quiz.history.find(h => h.user.toString() === req.user._id.toString());
    if (userHistory) {
      userHistory.score = score;
    } else {
      quiz.history.push({ user: req.user._id, score });
    }

    await quiz.save();

    res.status(200).json({ score });
  } catch (error) {
    res.status(500).json({ message: 'Error scoring quiz', error: error.message });
  }
};



exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
};


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
};


exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error: error.message });
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
};
exports.generateQuiz = async (req, res) => {
  try {
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdf(pdfBuffer);

    const pdfText = data.text;

   
    const quizData = await getQuizFromAI(pdfText);
 

    const newQuiz = new Quiz({
      title: 'Generated Quiz from PDF',  
      description: 'A quiz generated from the uploaded PDF content',
      questions: quizData,  
      createdBy: req.user._id,  
    });

    const savedQuiz = await newQuiz.save();

    
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error generating quiz', error: error.message });
  }
};