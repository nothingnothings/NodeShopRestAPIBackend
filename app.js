const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer');

const mongoose = require('mongoose');

const uuid = require('uuid').v4;

const app = express();

const MONGODB_URI =
  'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/nodeShopRestAPI?retryWrites=true&w=majority';

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const isAuth = require('./middleware/is-auth');
const shopController = require('./controllers/shop');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS'
  ); 
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, UserId'
  ); 
  next(); 
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single('image');

app.use(bodyParser.json()); 

app.use((req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      console.log('A MULTER ERROR HAS OCCURRED');
    } else if (error) {
      console.log('AN UNKNOWN ERROR HAS OCCURRED');
    
    }
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(adminRoutes);

app.use(authRoutes);

app.use(shopRoutes);

app.post('/create-order', isAuth, shopController.createOrder);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
