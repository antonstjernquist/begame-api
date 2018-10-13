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
    createdBy: {
        type: String,
        required: [true, 'Name field is required'],
    },
    created: Number,
    currentQuestion: Number,
    active: {
        type: Boolean,
        required: [true, 'flag is required'],
    },
    openForAnswer: {
        type: Boolean,
        required: [true, 'flag is required'],
    },
    quiz: Object,
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
