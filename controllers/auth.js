const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const User = require('../models/user.js');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error(
          'No user could be found for the entered email.'
        );
        error.statusCode = 404;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Invalid password. Please try again.');
        error.statusCode = 401;
        throw error;
      } else {
        const token = jwt.sign(
          { email: loadedUser.email, userId: loadedUser._id },
          keys.jwtSecret,
          { expiresIn: '1h' }
        );
        res.status(200).json({
          token: token,
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
