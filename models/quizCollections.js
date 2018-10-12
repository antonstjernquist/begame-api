const mongoose = requre('mongoose');

const Schema = mongoose.Schema;

const QuizCollectionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title field is required'],
  },
  questions: [
    {
      question: String,
      possibleAnswers: Array,
      correctAnswer: String,
    },
  ]
});

QuizCollectionSchema.pre('save', function (next) {
    //const collection = this;
        return next();
    }
});

module.exports = mongoose.model('QuizCollection', QuizCollectionSchema);
