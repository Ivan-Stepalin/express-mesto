const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, disLikeCard,
} = require('../controllers/cards');
const { cardValidation, idValidationation } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', idValidationation, deleteCard);
router.put('/:cardId/likes', idValidationation, likeCard);
router.delete('/:cardId/likes', idValidationation, disLikeCard);

module.exports = router;
