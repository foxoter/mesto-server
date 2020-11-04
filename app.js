const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use((req, res, next) => {
  req.user = {
    _id: '5fa2e5f513b03a0eac0a82e5',
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Resource is not found' });
});

app.listen(PORT);
