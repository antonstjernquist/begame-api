const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    roomId: {
        type: String,
        required: [true, 'Name field is required'],
    },
    currentQuestion: Number,
    active: {
        type: Boolean,
        required: [true, 'flag is required'],
    }
    questions: {
        name: {
            question: String,
            possibleAnswers: Object,
            correctAnswer: String,
          },
      }

});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;




ownerId(pin): null
roomId(pin): null
quiezId(pin): null
currentQuestion(pin): 0
started(pin): false
stoped(pin): false
ended(pin): false
mats(pin): 2
jonas(pin): 3

http://localhost:3000/room/fex2
