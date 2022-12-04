const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация 1' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'de252719f27a1b244d7eac7f05feba84e6dd6122f53e103f1f65c1effce0607f');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация 2' });
  }

  req.user = payload;
  next();
};
