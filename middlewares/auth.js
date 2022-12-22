const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'de252719f27a1b244d7eac7f05feba84e6dd6122f53e103f1f65c1effce0607f');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
  // const token = req.cookies.jwt;

  // if (!token) {
  //   next(new AuthError('Необходима авторизация'));
  //   return;
  // }

  // let payload;

  // try {
  //   payload = jwt.verify(token, '');
  // } catch (err) {
  //   next(new AuthError('Необходима авторизация'));
  //   return;
  // }

  // req.user = payload;
  // next();
};
