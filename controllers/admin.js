
const keys = require('../config/keys');

const stripe = require('stripe')(
  keys.stripeTestKey
);

const ObjectId = require('mongodb').ObjectId;

const Order = require('../models/order');
const User = require('../models/user');

exports.getCart = (req, res, _next) => {
  const userId = req.get('UserId');

  User.findOne({ _id: ObjectId(userId) })
    .populate('cart.products.productId')
    .then((user) => {
      res.status(200).json({
        message: 'Checkout served successfully.',
        products: user.cart.products,
        totalPrice: user.cart.products
          .map((product) => {
            return product.productId.price * product.quantity;
          })
          .reduce((prevValue, curValue) => {
            return prevValue + curValue;
          }, 0),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      });
    });
};

exports.getOrders = (req, res, _next) => {
  const userId = req.get('UserId');

  Order.find({ user: { userId: ObjectId(userId) } })
    .populate('products.product')
    .then((orders) => {
      res.status(200).json({
        orders: orders,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      });
    });
};

exports.deleteCartItem = (req, res, _next) => {
  const userId = req.get('UserId');
  const productId = req.body.productId;

  User.findById(userId)
    .then((user) => {
      const updatedProducts = user.cart.products.filter((product) => {
        return productId !== product.productId.toString();
      });
      user.cart.products = updatedProducts;

      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Product removed from cart successfully.',
        cart: result.cart,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      });
    });
};

exports.orderPost = (req, _res, _next) => {
  const token = req.body.stripeToken;

  let totalPrice = 0;

  req.user.populate('cart.products.productId').then((user) => {
    user.cart.products.forEach((product) => {
      totalPrice += product.productId.price * product.quantity;
    });

    const products = user.cart.products.map((product) => {
      return {
        quantity: product.quantity,

        product: { ...product.productId._doc },
      };
    });

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },

      products: products,

      totalPrice: products
        .map((product) => {
          return product.product.price * product.quantity;
        })
        .reduce((prevValue, curValue) => {
          return prevValue + curValue;
        }, 0),
    });

    order.save().then((result) => {
      const charge = stripe.charges.create({
        amount: Math.round(totalPrice * 100),
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: result._id.toString() },
      });

      return req.user.clearCart().then((_result) => {});
    });
  });
};

exports.postToCart = (req, res, _next) => {
  const userId = req.get('UserId');
  const productId = req.body.productId;

  User.findById(userId)
    .then((user) => {
      const cartProductIndex = user.cart.products.findIndex((prod) => {
        return productId === prod.productId.toString();
      });

      let newQuantity = 1;

      const updatedCartItems = [...user.cart.products];

      if (cartProductIndex >= 0) {
        newQuantity = user.cart.products[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: ObjectId(productId),
          quantity: newQuantity,
        });
      }

      const updatedCart = {
        products: updatedCartItems,
      };

      user.cart = updatedCart;
      user.save();

      return user.cart;
    })
    .then((cart) => {
      res.status(201).json({
        message: 'Product added to Cart.',
        cart: cart,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      });
    });
};
