const router = require('express')
  .Router();
const { updateProfileValidator, updateAvatarValidator, userIdValidator } = require('../validation/userValidation');
const {
  getUsers, getSingleUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', userIdValidator, getSingleUser);
router.patch('/me', updateProfileValidator, updateUserProfile);
router.patch('/me/avatar', updateAvatarValidator, updateUserAvatar);

module.exports = router;
