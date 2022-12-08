const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, 'de252719f27a1b244d7eac7f05feba84e6dd6122f53e103f1f65c1effce0607f');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
