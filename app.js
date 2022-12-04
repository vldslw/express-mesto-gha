const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouters = require('./routes/card');
const userRouters = require('./routes/user');
const {
  NOT_FOUND,
} = require('./constants/constants');
const {
  addUser, login,
} = require('./controllers/user');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', cardRouters);
app.use('/', userRouters);

app.post('/signin', login);
app.post('/signup', addUser);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT);
