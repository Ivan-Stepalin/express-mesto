const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      console.log(err);
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "ошибка id" });
      } else (
        ress.status(500).send({message: "Ошибка на сервере"})
      )
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'ошибка валидацации' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'ошибка валидацации' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'ошибка валидацации' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};