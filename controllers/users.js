const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users.length) {
        res.status(404)
          .send({ message: 'Userbase is empty' });
        return;
      }
      res.send({ data: users });
    })
    .catch(() => res.status(500)
      .send({ message: 'Internal server error' }));
};

module.exports.getSingleUser = (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).send({ message: 'Invalid id' });
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404)
          .send({ message: 'User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500)
        .send({ message: 'Internal server error' });
    });
};

module.exports.createUser = (req, res) => {
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
            res.status(400)
              .send({ message: `${err.message}` });
            return;
          }
          if (err.code === 11000) {
            res.status(400).send({ message: 'This email already exists' });
            return;
          }
          res.status(500)
            .send({ message: 'Internal server error' });
        });
    });
};

module.exports.updateUserProfile = (req, res) => {
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
        res.status(404)
          .send({ message: 'User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Some data is invalid' });
        return;
      }
      res.status(500)
        .send({ message: 'Internal server error' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res.status(404)
          .send({ message: 'User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Some data is invalid' });
        return;
      }
      res.status(500)
        .send({ message: 'Internal server error' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end('Authorization success');
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res
          .status(401)
          .send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Internal server error' });
    });
};
