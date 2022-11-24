const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUser = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
  .orFail(new Error('IdNotFound'))
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан невалидный _id пользователя' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
     }
  });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
  .orFail(new Error('IdNotFound'))
  .then((data) => res.status(200).send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });

};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .orFail(new Error('IdNotFound'))
  .then((data) => res.status(200).send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else if (err.message === 'IdNotFound') {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
};