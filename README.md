# CodeAlpha-SocialMedia-Project
🛒 ShopEase — E-commerce Store  A full-stack e-commerce web application built with Node.js, Express, MongoDB, and EJS.

✨ Features

ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js              ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  ← Register, Login, Logout
│   │   ├── productController.js ← Product CRUD
│   │   └── cartController.js  ← Cart + Orders
│   ├── middleware/
│   │   └── auth.js            ← isLoggedIn, isAdmin, setLocals
│   ├── models/
│   │   ├── User.js            ← User schema (with bcrypt)
│   │   ├── Product.js         ← Product schema
│   │   └── Order.js           ← Order schema
│   ├── routes/
│   │   ├── auth.js            ← /auth routes
│   │   ├── products.js        ← /products routes
│   │   ├── cart.js            ← /cart routes
│   │   ├── orders.js          ← /orders routes
│   │   └── admin.js           ← /admin routes
│   ├── public/
│   │   ├── css/style.css      ← All styles
│   │   ├── js/main.js         ← Client JS
│   │   └── uploads/           ← Product images
│   ├── .env.example           ← Copy to .env
│   ├── package.json
│   └── server.js              ← Entry point
└── frontend/
    └── views/                 ← All EJS templates
        ├── partials/          ← navbar, flash
        ├── auth/              ← login, register
        ├── products/          ← index, detail
        ├── cart/              ← cart page
        ├── orders/            ← checkout, my-orders
        ├── admin/             ← dashboard, products, orders
        ├── home.ejs
        └── error.ejs

🛡️ Security Features
Passwords hashed with bcryptjs (salt rounds: 12)
Sessions stored in MongoDB (survive restarts)
Route protection with isLoggedIn and isAdmin middleware
File uploads validated (images only, 5MB max)
Method override for proper REST verbs (PUT/DELETE)

📚 Tech Stack
Backend: Node.js + Express.js
Database: MongoDB + Mongoose ODM
Auth: express-session + bcryptjs
Views: EJS (Embedded JavaScript Templates)
File Uploads: Multer
Sessions stored in DB: connect-mongo
