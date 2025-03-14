const mongoose = require('mongoose');
const Catagory = require('./Catagory');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      questionText: { type: String, required: true },
      answers: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
        },
      ],
    },
  ],
  questionCount: { type: Number },
  focusArea: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  Catagory: { type: mongoose.Schema.Types.ObjectId, ref: 'Catagory' },
  history: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number },
    },
  ],
});
quizSchema.set('toJSON', { virtuals: true });
quizSchema.virtual('numberOfQuestions').get(function () {
  return this.questions.length;
});




module.exports = mongoose.model('Quiz', quizSchema);
