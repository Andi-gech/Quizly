const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const pdf = require('pdf-parse');

const util = require('util');
const officeParser = require('officeparser');
const tmp = require('tmp-promise');
const fs = require('fs').promises;
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

    let query = { private: false };
    let sort = {};

    if (catagory) {
      query.Catagory = catagory; 
    }

console.log(catagory,"catagory")
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

exports.getQuizzesByCatagory = async (req, res) => {
  try {
    
    const quizzes = await Quiz.find({ Catagory: req.params.catagoryId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
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

exports.getmyQuizzes = async (req, res) => {
  try {
  console.log(req.user.id)
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
}
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

    // Validate input
    const { title, Catagory, questionCount, focusArea,private } = req.body;
    console.log(req.body)
    if (!title || !Catagory) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    const mimeType = req.file.mimetype;
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Get user inputs
    const numQuestions = parseInt(questionCount) || 20; // Default to 20
    const studyFocus = focusArea || 'general content'; // Default if not provided

    const fileBuffer = req.file.buffer;
    let quizData;

    if (mimeType === 'application/pdf') {
      quizData = await getQuizFromAI(fileBuffer, mimeType, numQuestions, studyFocus);
    } else {
      
      let tempFile;
      try {
        tempFile = await tmp.file({ postfix: mimeType.includes('openxml') ? '.pptx' : '.ppt' });
     
        await fs.writeFile(tempFile.path, fileBuffer);
      
        const extractedText = await officeParser.parseOfficeAsync(tempFile.path);
        console.log('Temp file:', extractedText);
        quizData = await getQuizFromAI(extractedText, null, numQuestions, studyFocus);
      } finally {
        if (tempFile) await tempFile.cleanup();
      }
    }

    const newQuiz = new Quiz({
      title,
      description: 'AI-generated quiz',
      Catagory,
      questionCount: numQuestions,
      focusArea: studyFocus,
      questions: quizData,
      createdBy: req.user.id,
     private: private === 'true'? true : false
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);

  } catch (error) {
console.log(error)
    res.status(500).json({ 
      message: 'Quiz generation failed',
      error: error.message 
    });
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
exports.getprofilestats = async function getprofilestats(req, res) {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ 'history.user': userId });

    let totalQuizzesTaken = 0;
    let totalPoints = 0;
    let totalQuestionsDone = 0;

    quizzes.forEach(quiz => {
      const userHistory = quiz.history.find(h => h.user.toString() === userId.toString());
      if (userHistory) {
        totalQuizzesTaken++;
        totalPoints += userHistory.score;
        totalQuestionsDone += quiz.questions.length;
      }
    });

    res.status(200).json({
      totalQuizzesTaken,
      totalPoints,
      totalQuestionsDone
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ message: 'Error fetching profile stats', error: error.message });
  }
}
