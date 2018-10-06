const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    questions: [
         {
             question: String,
             possibleAnswers: Array,
             correctAnswer: String,
         },

    ]
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;