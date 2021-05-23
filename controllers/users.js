const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const NotFoundError = require("../errors/notFoundError");
const BadRequestError = require("../errors/badRequestError");
const AuthorizedError = require("../errors/authorizedError");
const ConflictError = require("../errors/conflictError");
const ServerError = require("../errors/serverError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'пользователь в базе данных не найден' }); */
      } else if (err.name === "CastError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(200).send({ data: { _id: user._id, email: user.email } })
    )
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        throw new ConflictError(err.message);
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else if (err.message === "NotFound") {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'Пользователь с указанным id не найден' }); */
      } else if (err.name === "CastError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else if (err.message === "NotFound") {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'Пользователь с указанным id не найден' }); */
      } else if (err.name === "CastError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      const data = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.send({ data, token });
    })
    .catch((err) => {
      throw new AuthorizedError(err.message);
      /* res.status(401).send({ message: err.message }); */
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error("Пользователь с таким id не найден"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else if (err.message === "NotFound") {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'Пользователь с указанным id не найден' }); */
      } else if (err.name === "CastError") {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};