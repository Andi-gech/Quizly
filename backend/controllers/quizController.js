const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const pdf = require('pdf-parse');
const { getQuizFromAI} = require('../services/generativeAIService');


exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions,Catagory } = req.body;
    const newQuiz = new Quiz({
      
      title,
      description,
      questions,
      createdBy: req.user.id, 
      Catagory
     
    });
    console.log(Catagory)
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
    console.log(req.user)

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

  
        if (selectedAnswer && selectedAnswer?.isCorrect) {
      
          score++;
     
        }
      }
    }


    const userHistory = quiz.history.find(h => h?.user.toString() === req?.user.id?.toString());
    if (userHistory) {
      userHistory.score = score;
    } else {
      quiz.history.push({ user: req.user.id, score });
    }


 
































































    await quiz.save();

    return res.status(200).json({ score });
  } catch (error) {
    console.error('Error scoring quiz:', error);
    res.status(500).json({ message: 'Error scoring quiz', error: error.message });
  }
};



exports.getAllQuizzes = async (req, res) => {
  try {
    const { catagory, searchTitle = '', sortByHistory = false } = req.query;

    let query = {};
    let sort = {};

    if (catagory) {
      query.Catagory = catagory; 
    }


    if (searchTitle) {
      query.title = { $regex: searchTitle, $options: 'i' }; 
    }

    if (sortByHistory) {
      sort = { views: -1 }; 
    } else {
      sort = { createdAt: -1 };
    }


    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'username')
      .populate('Catagory')
      .sort(sort)
      .exec();

    if (quizzes.length !== 0) {
      const quizzesWithNumberOfQuestions = quizzes.map(quiz => quiz.toJSON({ virtuals: true })).reduce((acc, quiz) => {
        acc.push({ 
          title: quiz.title, 
          description: quiz.description, 
          _id: quiz._id, 
          numberOfQuestions: quiz.numberOfQuestions,
          catagory:quiz.Catagory
        });
        return acc;
      }, []);
      
      return res.status(200).json(quizzesWithNumberOfQuestions);
    }

  
    res.status(200).json([]);
    
  } catch (error) {
    console.error('Error fetching quizzes:', error);
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
    console.log(data)

    const pdfText = data.text;

   
    const quizData = await getQuizFromAI(pdfText);
 

    const newQuiz = new Quiz({
      title:req.file.originalname,  
      description: 'A quiz generated from the uploaded PDF content',
      questions: quizData,  
      createdBy: req.user.id,  
    });

    const savedQuiz = await newQuiz.save();

    
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.log('Error generating quiz:', error);
    res.status(500).json({ message: 'Error generating quiz', error: error.message });
  }
};

exports.LeaderBoard = async function getTotalScores(req, res) {
  try {
    const results = await Quiz.aggregate([
      { $unwind: '$history' },
      { $group: {
        _id: '$history.user',
        totalScore: { $sum: '$history.score' }
      }},
      { $sort: { totalScore: -1 } } 
    ])

    const users = await User.find({ _id: { $in: results.map(r => r._id) } });

    const leaderBoard = results.map(result => {
      const user = users.find(u => u?._id?.toString() === result?._id?.toString());
      return {
        user: user?.username|| 'Unknown',
        totalScore: result?.totalScore
      }
    });

    res.status(200).json(leaderBoard);
  } catch (error) {
    console.error('Error aggregating total scores:', error);
    throw error;
  }
}