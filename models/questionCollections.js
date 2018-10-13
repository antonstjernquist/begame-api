const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionCollectionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title field is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  imgUrl: {
    type: String,
    required: [true, 'Title field is required'],
  },
  description: {
    type: String,
    required: [true, 'Title field is required'],
  },
  questions: Object,
});

module.exports = mongoose.model('QuestionCollection', QuestionCollectionSchema);
