const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Card = require('./models/card');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '637c41731c53eb9da9483e14'
  };

  next();
});

app.get('/users', (req, res) => {
  User.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
});

app.get('/cards', (req, res) => {
  Card.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
});

app.get('/users/:userId', (req, res) => {
  const id = req.params.userId;

  User.findById(id)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => res.status(500).send(err));

});

app.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => res.status(500).send(err));

});

app.post('/cards', (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id

  Card.create({ name, link, owner})
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send(err));

});

app.delete('/cards/:cardId', (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send(err));

});

app.patch('/users/me', (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
});

app.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
});

app.put('/cards/:cardId/likes', (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send(err));
});

app.delete('/cards/:cardId/likes', (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send(err));
});

app.listen(3000, () => {
  console.log('Server started');
});