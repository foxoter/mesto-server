const router = require('express').Router();
const { getUsers, getSingleUser, createUser, updateUserProfile, updateUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getSingleUser);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
