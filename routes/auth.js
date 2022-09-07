const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

const authController = require('../controllers/auth');

router.post(
  '/login',
  [
    body('email')
      .isEmpty()
      .withMessage('You must input an email.')
      .isEmail()
      .withMessage('Inputted email is not valid.')
      .normalizeEmail(),

    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Your password has to have at least 6 characters.')
      .not()
      .isEmpty()
      .withMessage('You must input a password'),
  ],
  
  authController.login
);

module.exports = router;
