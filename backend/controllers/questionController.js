const Question = require('../models/questionModel');

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        status: 'fail',
        message: 'No question found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return res.status(404).json({
        status: 'fail',
        message: 'No question found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({
        status: 'fail',
        message: 'No question found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
        message: err.message,
    });
    }
}
