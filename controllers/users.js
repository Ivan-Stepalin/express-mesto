const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Невалидный id" });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'пользователь в базе данных не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Невалидный id" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.userId, { name, about })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Пользователь с указанным id не найден" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Невалидный id" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.userId, { avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Пользователь с указанным id не найден" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Невалидный id" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
