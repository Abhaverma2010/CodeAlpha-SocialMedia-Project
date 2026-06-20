# CodeAlpha-SocialMedia-Project
A full-stack Social Media web application built with Node.js, Express.js, MongoDB, EJS, and JavaScript. The project includes user authentication, product management, shopping cart functionality, order management, and an admin dashboard.
# ⚡ Vibe — Mini Social Media Platform

Vibe is a full-stack social media application built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. It allows users to create posts, interact with others through likes and comments, follow other users, and manage their profiles.

 📌 Features
 
👤 Authentication
* User registration
* User login and logout
* Session-based authentication

 📝 Posts
* Create text posts with optional images
* View a personalized feed
* Explore posts from all users
* Like and unlike posts
* Add and delete comments
* Delete your own posts

👥 User Profiles
* View user profiles
* Edit profile information and avatar
* Follow and unfollow other users
* View followers and following lists
* Search for users
* Discover suggested users


 📁 Project Structure

socialmedia/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    └── views/
        ├── partials/
        ├── auth/
        ├── posts/
        ├── users/
        ├── landing.ejs
        └── error.ejs
```

 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS, HTML, CSS, JavaScript
* **Database:** MongoDB
* **Authentication:** Express Sessions
* **Password Security:** bcrypt
* **Session Store:** connect-mongo

📍 Main Routes

| Feature                   | Endpoint                               |
| ------------------------- | -------------------------------------- |
| Landing Page              | `/`                                    |
| Register / Login / Logout | `/auth/*`                              |
| Personalized Feed         | `/feed`                                |
| Explore Posts             | `/explore`                             |
| Create Post               | `/posts/new`                           |
| Like or Unlike Post       | `POST /posts/:id/like`                 |
| Add Comment               | `POST /posts/:id/comment`              |
| Delete Comment            | `POST /posts/:id/comments/:cid/delete` |
| Delete Post               | `DELETE /posts/:id`                    |
| User Profile              | `/users/:username`                     |
| Follow / Unfollow User    | `POST /users/:id/follow`               |
| Followers List            | `/users/:username/followers`           |
| Following List            | `/users/:username/following`           |
| Discover Users            | `/users/discover`                      |
| Search Users              | `/users/search?q=`                     |
| Profile Settings          | `/users/settings`                      |

---

## 💡 Key Implementation Highlights

* Embedded comments stored directly within post documents.
* Atomic follow/unfollow and like/unlike operations using MongoDB update operators.
* Personalized feed based on followed users.
* Reusable EJS partials for consistent UI components.
* Middleware for authentication and global user data injection.
* Secure session management with MongoDB-backed session storage.


This project is intended for educational and learning purposes. Feel free to modify and extend it for your own use.

