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
    },
    questions: Object,

});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
