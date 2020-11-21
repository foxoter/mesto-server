const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const urlValidator = validator.isURL;
const emailValidator = validator.isEmail;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => emailValidator(email),
      message: 'Email validation failed',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlValidator(link),
      message: 'URL validation failed',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Invalid login or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Invalid login or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
