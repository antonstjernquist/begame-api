const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActiveUsers = new Schema({
    name: String,
    points: Number,
    roomId: String,
  });

module.exports = mongoose.model('ActiveUsers', ActiveUsers);
