const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, disLikeCard,
} = require('../controllers/cards');
const { cardValidation, idValidationation } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:id', idValidationation, deleteCard);
router.put('/:id/likes', idValidationation, likeCard);
router.delete('/:id/likes', idValidationation, disLikeCard);

module.exports = router;
