const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    questions: {
        type: Array,
        required: [true, 'Minimum 5 questions is required']
    },
});

const Playlist = mongoose.model('Quiz', QuizSchema);

module.exports = Playlist;