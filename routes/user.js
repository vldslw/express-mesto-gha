const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/user');
const auth = require('../middlewares/auth');
const { urlPattern } = require('../constants/constants');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUser);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlPattern),
  }).unknown(true),
}), updateAvatar);
router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), getUser);

module.exports = router;
