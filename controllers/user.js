const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK,
} = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-error');

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(OK).send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'de252719f27a1b244d7eac7f05feba84e6dd6122f53e103f1f65c1effce0607f',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.status(OK).send(data))
    .catch(() => {
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .orFail(new Error('IdNotFound'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный _id пользователя');
      } else if (err.message === 'IdNotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('IdNotFound'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный _id пользователя');
      } else if (err.message === 'IdNotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('IdNotFound'))
    .then((data) => res.status(OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      } else if (err.message === 'IdNotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('IdNotFound'))
    .then((data) => res.status(OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
      } else if (err.message === 'IdNotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};
