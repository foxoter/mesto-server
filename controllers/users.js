const mongoose = require('mongoose');
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
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send({ data: user }))
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
