const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');

router.get('/cards', auth, getCards);
router.post('/cards', auth, createCard);
router.delete('/cards/:cardId', auth, deleteCard);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;
