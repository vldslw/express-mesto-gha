const Card = require('../models/card');
const {
  OK,
} = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((data) => res.status(OK).send(data))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((data) => {
      Card.findById(data._id)
        .populate(['owner', 'likes'])
        .then((card) => res.status(OK).send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((card) => {
      if (card.owner.id === req.user._id) {
        card.remove()
          .then(() => res.status(OK).send(card))
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному id не найдена');
    })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному id не найдена');
    })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
