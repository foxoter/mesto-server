const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFountError');
const BadRequestError = require('../errors/badRequestError');
const NotUniqueError = require('../errors/notUniqueError');
const AuthError = require('../errors/authError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users.length) {
        throw new NotFoundError('No users for now');
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getSingleUser = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No users match this id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!password) {
    res.status(400).send({ message: 'Invalid or empty password' });
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError(`${err.message}`);
          }
          if (err.code === 11000) {
            throw new NotUniqueError('This email already exists');
          }
        })
        .catch(next);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (typeof name !== 'string' || typeof about !== 'string') {
    res.status(400).send({ message: 'Invalid request' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found...');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found...');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${err.message}`);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({message: 'Authorization success'});
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new AuthError(`${err.message}`);
      }
    })
    .catch(next);
};
