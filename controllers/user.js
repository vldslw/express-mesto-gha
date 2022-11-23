const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
};

module.exports.getUser = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => res.status(500).send(err));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => res.status(500).send(err));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));

};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
};