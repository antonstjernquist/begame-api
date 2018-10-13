const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionCollectionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title field is required'],
  },
  imgUrl: {
    type: String,
    required: [true, 'Title field is required'],
  },
  description: {
    type: String,
    required: [true, 'Title field is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  questions: {
      name: {
          question: String,
          possibleAnswers: Object,
          correctAnswer: String,
        },
    }
});

module.exports = mongoose.model('QuestionCollection', QuestionCollectionSchema);
