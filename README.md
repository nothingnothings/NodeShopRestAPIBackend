<h1 align="center">NodeShop - A Node.js-inspired online shop, powered by Node.js (Express.js)</h1>
<p align="center">
  <img src="images/NodeShopBlack.png" alt="NodeShop-logo" width="120px" height="120px"/>
  <br>
  <i>This application is the backend portion of the NodeShop REST API app, built with 
    <br>Node.js (Express.js), helped by a noSQL database solution (MongoDB) and hosted on Heroku.</i>
  <br>
</p>

<p align="center">
  <a href="https://nothingnothings.github.io/NodeShopRestAPI"><strong>https://nothingnothings.github.io/NodeShopRestAPI</strong></a>
  <br>
</p>




## Introduction

The backend of ["NodeShop"](https://github.com/nothingnothings/NodeShopRestAPI), the frontend Single Page Application (SPA) project built with the ReactJS (create-react-app) library.

The app, as its name suggests, was created using Node.js and the Express.js framework, and its contents were hosted in the Heroku platform, connected to GitHub.
This app is also available as a "multi-page" app, without ReactJS and without a REST API backend. The project can be found [here](https://github.com/nothingnothings/NodeShopMultiPageApp).

![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/nothingnothings/NodeShopRestAPIBackend/master?style=flat-square)
[![HitCount](https://hits.dwyl.com/nothingnothings/NodeShopRestAPIBackend.svg?style=flat-square)](http://hits.dwyl.com/nothingnothings/NodeShopRestAPIBackend)


 
## Technologies 
 
 Some of the Languages, Packages and Libraries employed on this backend:
 
 - Node
 - Express.js (middleware-based Node.js framework; used for an enhanced backend endpoint setup)
 - Node Package Manager (for bootstrapping and managing the Node backend app)
 - MongoDB (noSQL database storage solution; storage of `user`, `product` and `order` objects into collections in a remote MongoDB Atlas database)
 - Stripe (dummy integration of the Stripe payment platform with the app, for the handling of "orders" made by the user)
 - `body-parser` (needed for the parsing of the JSON data sent by the frontend)
 - `bcryptjs` (used for storing encrypted passwords inside of `user` documents on MongoDB database)
 - `multer` - used for receiving product image files, on the "Add a Product" endpoint (disabled on this demo version of the app)
 - `jsonwebtoken` (for the generation of JSON Web Tokens, which are then stored on the local storage of the user's browser and then checked for authentication)
 - `pdfkit` (generation of pdf documents for each `order` produced by a user)
 - `express-validator` (validation of inputted user data, on the backend, with methods such as "isEmpty()" and "isLength()")
 
 
## Project Directory Structure

The REST API backend's directory structure:


```
.\
│
├── config\
│   ├── keys.js
│   └── prod.js
│
├── controllers\
│   ├── admin.js
│   ├── auth.js
│   └── shop.js
│
├── faturas\
│   ├── fatura-62e04d5c7ae0d991d83b1323.pdf
│   ├── fatura-62e18ad75511c94e87929855.pdf
│   ├── fatura-62e1a06e5511c94e87929fa4.pdf
│   ├── fatura-62eb1fa9e4c7306961ced46b.pdf
│   ├── fatura-62fc5a5c928dcb70525b5e11.pdf
│   └── fatura-62fc5a897fbf69bdbe21af55.pdf
│
├── images\
│   ├── 1658431838529-Bike.png
│   ├── 1658432590831-Boat.png
│   ├── 1658433107407-Pencil.png
│   ├── 1658433305838-Skateboard.png
│   ├── 1658433495040-keyboard.png
│   ├── 1658434189280-A set of tires.png
│   ├── 1658434649972-Boomerang.png
│   ├── 1658435067043-Drums.png
│   ├── 1658435608982-Violin.png
│   └── NodeShopBlack.png
│
├── middleware\
│   └── is-auth.js
│
├── models\
│   ├── order.js
│   ├── product.js
│   └── user.js
│
├── public\
│
├── routes\
│   ├── admin.js
│   ├── auth.js
│   └── shop.js
│
├── util\
│   └── path.js
│
├── README.md
├── app.js
├── package-lock.json
└── package.json
```


## Project Configuration Files (package.json)

The package.json file used in the project:

```
{
  "name": "nodejs-restapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^8.5.1",
    "mongodb": "^4.8.1",
    "mongoose": "^6.5.1",
    "multer": "^1.4.5-lts.1",
    "pdfkit": "^0.13.0",
    "stripe": "^10.0.0",
    "uuid": "^8.3.2"
  }
}

```

## Setup 


To use this project, clone it using Git:

1. Run `git clone` to clone the project into your local Git repository
2. Run `npm install` to install all dependencies (`express`, `bcryptjs`, `mongodb`, etc)
3. Run `npm start` to spin up the the app
4. Use the server locally or deploy it on the web, with the help of a hosting provider (e.g. Heroku)
5. For the purposes of this demo, on the "Get Started" (Authentication) page, input the credentials `exemplo@exemplo.com` (email) and `exemplo` (password) to access the apps's various features


## Features 

- Connected to a Single-Page Application ( no page reloads, REST API); serving of a single HTML file (index.html file, "skeleton" for the ReactJS components)
- For deployment demonstration purposes, only a single user is enabled/created on the serverside, with the credentials `exemplo@exemplo.com` (email field) and `exemplo` (password field). Creation of additional users ("No account? Join NodeShop") is possible in the complete app (in this demo app, the account creation endpoints are disabled). Furthermore, the "Orders" made by the user are reset every 60 minutes (MongoDB Time to Live Index feature), and the products added to the "Cart", every 8 hours (MongoDB "Scheduled Trigger" feature)
- Serverside form input validation logic, powered by `express-validator`
- Simple pagination logic for the list of products
- Backend uses and manages the "User", "Product", "Order" and "Cart" objects, which are stored on a MongoDB database (MongoDB Atlas service); the Node.js server and MongoDB database also handle the authentication logic (login/signup) implemented on the app
- Dummy representation of the possible integration of shop apps with Stripe, with the `react-stripe-checkout` package and corresponding serverside logic producing effects on the frontend (page redirection and visual update of "orders" page)
- Viewing of each order's invoices/faturas in .pdf files, produced by the backend (`pdfkit` package)
- Usage of environment variables with Heroku to hide sensitive information (API_KEYS, Json Web Token secrets, database usernames and passwords, etc.)


## Inspiration

This app was based on the applications seen on the "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)" course by Maximilian Schwarzmüller.
