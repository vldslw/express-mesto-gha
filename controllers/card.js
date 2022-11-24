const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id

  Card.create({ name, link, owner})
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(new Error('IdNotFound'))
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .orFail(new Error('IdNotFound'))
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .orFail(new Error('IdNotFound'))
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};
