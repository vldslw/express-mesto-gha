const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.status(OK).send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
    .orFail(new Error('IdNotFound'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
      } else if (err.message === 'IdNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('IdNotFound'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
      } else if (err.message === 'IdNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addUser = (req, res) => {
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
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('IdNotFound'))
    .then((data) => res.status(OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'IdNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('IdNotFound'))
    .then((data) => res.status(OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.message === 'IdNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
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
