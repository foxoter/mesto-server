const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards.length) {
        res.status(404).send({ message: 'Cards base is empty' });
        return;
      }
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Internal server error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Some data is invalid' });
        return;
      }
      res.status(500).send({ message: 'Internal server error' });
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Invalid id' });
    return;
  }
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal server error' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Invalid id' });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal server error' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Invalid id' });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal server error' });
    });
};
