# CodeAlpha-SocialMedia-Project
🛒A full-stack Social Media web application built with Node.js, Express.js, MongoDB, EJS, and JavaScript. The project includes user authentication, product management, shopping cart functionality, order management, and an admin dashboard.

👤 User Features
User registration and login
Secure password hashing using bcrypt
User authentication and authorization
Browse available products
View product details
Add products to cart
Checkout and place orders
View order history
Logout functionality

🛠️ Admin Features
Admin authentication
Add new products
Update existing products
Delete products
View and manage customer orders
Access admin dashboard

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

📂 Major Components
Configuration
config/db.js – Establishes the MongoDB database connection.
Controllers
authController.js – Handles registration, login, and logout.
productController.js – Manages product CRUD operations.
cartController.js – Handles cart and order-related functionality.
Middleware
auth.js – Authentication, authorization, and role-based access control.
Models
User.js – User schema and password hashing.
Product.js – Product data model.
Order.js – Order management schema.
Routes
Authentication routes
Product routes
Cart routes
Order routes
Admin routes
Public Assets
CSS styles
Client-side JavaScript
Uploaded product images
Views
Authentication pages
Product listing and details
Shopping cart
Checkout and order history
Admin dashboard
Shared partial templates
🔐 Authentication

The application supports:

User registration
Secure login
Password hashing with bcrypt
Session-based authentication
Protected routes
Admin-only access for management operations

📦 Core Functionalities
User account management
Product catalog
Shopping cart
Order placement
Order history
Admin product management
Admin order management

📈 Future Improvements
Payment gateway integration
Product search and filtering
Wishlist feature
Product reviews and ratings
Email notifications
Inventory management
Responsive UI enhancements
Image storage using cloud services
REST API documentation
Unit and integration testing

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
