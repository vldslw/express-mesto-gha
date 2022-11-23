const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('user', userSchema);