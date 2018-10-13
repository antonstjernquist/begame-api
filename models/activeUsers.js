const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActiveUsers = new Schema({
    activeUsers:[
        {
            name: String,
            points: Number,
        }
    ],
    roomId: String,
  });

module.exports = mongoose.model('ActiveUsers', ActiveUsers);
