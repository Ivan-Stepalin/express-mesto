const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { resourceError } = require('./controllers/resourceError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '608bc22c70e5a42434598635',
  };

  next();
});

app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.use('*', resourceError);

app.listen(PORT);
