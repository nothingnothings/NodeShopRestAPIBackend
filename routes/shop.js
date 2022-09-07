const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/shop', shopController.getProducts);

router.get('/shop/:productId', shopController.getProductDetail);

module.exports = router;
