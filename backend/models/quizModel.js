const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [{
    questionText: { type: String, required: true },
    explanation: { type: String, required: true },
    answers: [{
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }
    }]
  }],
  private: { type: Boolean, default: false },
  Catagory: { type: mongoose.Schema.Types.ObjectId, ref: 'Catagory' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    date: { type: Date, default: Date.now }
  }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

quizSchema.virtual('numberOfQuestions').get(function() {
  return this.questions.length;
});

module.exports = mongoose.model('Quiz', quizSchema);