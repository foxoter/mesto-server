const router = require('express')
  .Router();
const {
  getUsers, getSingleUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/:id', auth, getSingleUser);
router.patch('/me', auth, updateUserProfile);
router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
