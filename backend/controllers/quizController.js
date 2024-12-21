const Quiz = require('../models/quizModel');


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
