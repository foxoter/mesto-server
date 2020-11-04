const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      if (!users.length) {
        res.status(404).send({message: 'Userbase is empty'});
        return
      }
      res.send({ data: users })
    })
    .catch(() => res.status(500).send({ message: 'Internal server error' }));
}

module.exports.getSingleUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).send({message: 'User not found'});
        return
      }
      res.send({data: user});
    })
    .catch(err => res.status(500).send({message: 'Internal server error'}));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Some data is invalid'});
        return;
      }
      res.status(500).send({message: 'Internal server error'});
    });
}

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Some data is invalid' });
        return;
      }
      res.status(500).send({ message: 'Internal server error' });
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
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Some data is invalid' });
        return;
      }
      res.status(500).send({ message: 'Internal server error' });
    });
};
