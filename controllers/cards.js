const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      if (!cards.length) {
        res.status(404).send({message: 'Cards base is empty'});
        return
      }
      res.send({data: cards});
    })
    .catch(err => res.status(500).send({message: 'Internal server error'}));
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then(card => res.send({data: card}))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Some data is invalid'});
        return
      }
      res.status(500).send({message: 'Internal server error'});
    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => {
      if (!card) {
        res.status(404).send({message: 'Card not found'});
        return
      }
      res.send({data: card});
    })
    .catch(err => {
      res.status(500).send({message: 'Internal server error'});
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true },
  )
    .populate('likes')
    .then(card => {
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
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  )
    .populate('likes')
    .then(card => {
      if (!card) {
        res.status(404).send({message: 'Card not found'});
        return;
      }
      res.send({data: card});
    })
    .catch(() => {
      res.status(500).send({message: 'Internal server error'});
    })
};

