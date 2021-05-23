const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { resourceError } = require('./controllers/resourceError');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registrValidation, loginValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger'); 
const cors = require('cors');
require('dotenv').config();

const { PORT = 3005 } = process.env;

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

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors({
  origin: ['http://stepalin.students.nomoredomains.monster', 
  'https://stepalin.students.nomoredomains.monster']
}));

app.post('/signup', registrValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);
app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.use('*', resourceError);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.send({ message: err.message });
  next();
});

app.listen(PORT);
