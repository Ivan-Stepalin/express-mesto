const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { resourceError } = require('./controllers/resourceError');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registrValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signup', registrValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);
app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.use('*', resourceError);

app.use(errors());

app.use((err, req, res, next) => {
  res.send({ message: err.message });
  next();
});

app.listen(PORT);
