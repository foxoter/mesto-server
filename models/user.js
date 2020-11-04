const mongoose = require('mongoose');
const validator = require('validator');
const urlValidator = validator.isURL;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlValidator(link),
      message: 'URL validation failed'
    }
  }
})

module.exports = mongoose.model('user', userSchema);
