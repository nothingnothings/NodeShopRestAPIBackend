const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop');
const adminController = require('../controllers/admin');

router.get('/admin-shop', isAuth, shopController.getProducts);

router.get('/orders', isAuth, adminController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getFatura);

router.get('/cart', isAuth, adminController.getCart);

router.post('/cart', isAuth, adminController.postToCart);

router.delete('/cart', isAuth, adminController.deleteCartItem);

module.exports = router;
