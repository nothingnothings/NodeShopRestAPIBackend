const fs = require('fs');
const path = require('path');
const pdfPath = path.join(__dirname, '..', 'faturas');

const PDFDocument = require('pdfkit');

const ObjectId = require('mongodb').ObjectId;

const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const keys = require('../config/keys');

const ITEMS_PER_PAGE = 3;



const stripe = require('stripe')(
  keys.stripeTestKey
);

exports.getProductDetail = (req, res, _next) => {
  const productId = req.params.productId.trim();

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error('Could not find product');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: 'Product fetched.',
        product: product,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        res.status(500).json({
          message: 'Something went wrong',
          error: err,
        });
      }
    });
};

exports.getProducts = (req, res, _next) => {
  const pageNumber = parseInt(req.query.page) || 1;

  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      return Product.find()
        .skip((pageNumber - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('userId', 'name')
        .then((products) => {
          res.status(200).json({
            products: products,
            currentPage: +pageNumber,
            hasNextPage: ITEMS_PER_PAGE * pageNumber < totalItems,
            hasPreviousPage: +pageNumber > 1,
            previousPageNumber: pageNumber - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      });
    });
};

exports.getFatura = (req, res, _next) => {
  const orderId = req.params.orderId;
  const userId = req.get('UserId');
  const invoiceName = 'fatura-' + orderId + '.pdf';
  const invoicePath = `${pdfPath}/${invoiceName}`;

  Order.findById(ObjectId(orderId)).then((order) => {
    if (!order) {
      res.status(404).json({
        message: 'Order not found.',
        redirect: true,
      });
    } else {
      if (order.user.userId.toString() !== userId.toString()) {
        res.status(404).json({
          message: 'Your user was not responsible for that order.',
          redirect: true,
        });
      } else {
        const pdfDoc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `inline; filename="${invoiceName}"`
        );

        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Fatura', {
          align: 'center',
        });
        pdfDoc.text('------------------------------------------------------');
        order.products.forEach((prod) => {
          pdfDoc
            .fontSize(20)
            .text(
              'Produto: ' +
                prod.product.title +
                ' - ' +
                prod.quantity +
                'x' +
                ' $ ' +
                prod.product.price
            );
        });
        pdfDoc.fontSize(25).text(' ');
        pdfDoc.text('------------------------------------------------------');
        pdfDoc.fontSize(25).text('Preço total: $' + order.totalPrice);
        pdfDoc.end();
      }
    }
  });
};

exports.createOrder = (req, res, _next) => {
  const token = JSON.parse(req.body.token);

  const stripeToken = token.id;

  let totalPrice = 0;

  const userId = req.get('UserId');

  User.findById(userId)
    .populate('cart.products.productId')
    .then((user) => {
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
          userId: ObjectId(userId),
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

      order
        .save()
        .then((result) => {
          const charge = stripe.charges.create({
            amount: Math.round(totalPrice * 100),
            currency: 'brl',
            description: 'Demo Order',
            source: stripeToken,
            metadata: { order_id: result._id.toString() },
          });
          return User.findById(userId).then((user) => {
            user.cart = [];
            return user.save();
          });
        })
        .then((_result) => {
          res.status(200).json({
            message: 'Order successfully created.',
          });
        });
    });
};
