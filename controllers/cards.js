const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ServerError = require('../errors/serverError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'ошибка валидации' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((data) => {
      if (data) {
        if (req.user._id === data.owner._id.toString()) {
          Card.findByIdAndRemove(req.params.id)
            .then((card) => res.send({ data: card }));
        } else if (req.user._id !== data.owner._id.toString()) {
          throw new ForbiddenError('У вас нет прав удалять чужую карточку');
        }
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    // if (!data) {
    //   throw new NotFoundError('Запрашиваемая карточка не найдена');
    // }
    // if (data.owner._id.toString() !== req.user._id) {
    //   throw new ForbiddenError('Вы не можете удалить чужую карточку.');
    // }
    // Card.findByIdAndRemove(req.params.id)
    //   .then((card) => res.status(200).send({data: card}))
    //   .catch(next);
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'пользователь в базе данных не найден' }); */
      } else if (err.name === 'CastError') {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};

module.exports.disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
        /* res.status(404).send({ message: 'пользователь в базе данных не найден' }); */
      } else if (err.name === 'CastError') {
        throw new BadRequestError(err.message);
        /* res.status(400).send({ message: 'Невалидный id' }); */
      } else {
        throw new ServerError(err.message);
        /* res.status(500).send({ message: 'На сервере произошла ошибка' }); */
      }
    })
    .catch(next);
};
