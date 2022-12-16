const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');
const { urlPattern } = require('../constants/constants');

router.get('/cards', auth, getCards);
router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlPattern),
  }).unknown(true),
}), createCard);
router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), deleteCard);
router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), likeCard);
router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
