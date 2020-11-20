const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: 'Authorization required' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Authorization required' });
  }
  req.user = payload;
  return next();
};
