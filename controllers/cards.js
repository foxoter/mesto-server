const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require("../errors/notFountError");
const BadRequestError = require("../errors/badRequestError");
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards.length) {
        throw new NotFoundError('There are no cards yet...');
      }
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) =>
      res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${err.message}`)
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.id;
  Card.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('No card is matching that id...')
      }
      if (card.owner.id !== req.user._id) {
        throw new ForbiddenError('You have no rights to delete this card')
      }
      Card.deleteOne(card).then(() => res.send({ data: card }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
        throw new NotFoundError('There are no cards matching this id...');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new NotFoundError('There are no cards matching this id...');
      }
      res.send({ data: card });
    })
    .catch(next);
};
