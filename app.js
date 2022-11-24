const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouters = require('./routes/card');
const userRouters = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '637c41731c53eb9da9483e14'
  };

  next();
});

app.use('/', cardRouters);
app.use('/', userRouters);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});