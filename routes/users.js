const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { idValidationation, userAvatarValidation, getUserInfoValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', idValidationation, getUserById);
router.patch('/me', getUserInfoValidation, updateUser);
router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
