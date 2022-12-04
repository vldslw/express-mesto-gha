const router = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUser);
router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
