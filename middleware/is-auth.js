const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (req, res, next) => {
  const header = req.get('Authorization');

  if (!header) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const actualToken = header.split(' ')[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      actualToken,
      keys.jwtSecret
    );
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
