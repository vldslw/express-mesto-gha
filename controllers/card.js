const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id

  Card.create({ name, link, owner})
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send(err));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send(err));

};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
);

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
);