# 🛒 E-Commerce Marketplace – Buyer & Seller

A full-stack **E-Commerce Marketplace** built with the **MERN Stack**, featuring separate Buyer and Seller experiences. Buyers can browse products, manage their cart, add delivery addresses, and make payments, while Sellers can manage products and track their marketplace activity.

## 🚀 Live Demo

🔗 **Live Website:** [https://snitch-project-zuqv.onrender.com/]

---

## 🎥 Demo Videos

### 👤 Buyer Demo

▶️ [Watch Buyer Demo] (https://github.com/user-attachments/assets/a65f57c8-3102-423d-a6fe-1c7430323569)

The Buyer side demonstrates:

* User registration and login
* Product browsing
* Product details
* Add to cart
* Cart management
* Address management
* Checkout
* Payment gateway
* Order placement

### 🏪 Seller Demo

▶️ [Watch Seller Demo](https://github.com/user-attachments/assets/a81f3807-d769-41a6-92cf-e938cf94b6d5)

The Seller side demonstrates:

* Seller authentication
* Seller dashboard
* Add products
* Upload product images
* Product management
* Order management
* Seller marketplace functionality

---

## ✨ Features

### 👤 Buyer Features

* 🔐 User Registration & Login
* 🔑 JWT-based Authentication
* 🔒 Password Hashing with bcrypt
* 🛍️ Browse Products
* 🔎 Product Details
* 🛒 Add to Cart
* ➕ Update Cart Quantity
* ➖ Remove Products from Cart
* 📍 Add & Manage Delivery Addresses
* 💳 Online Payment Gateway
* 📦 Place Orders
* 📱 Responsive UI

### 🏪 Seller Features

* 🔐 Seller Authentication
* 📊 Seller Dashboard
* ➕ Add New Products
* 🖼️ Product Image Upload
* ☁️ Image Storage using ImageKit
* ✏️ Manage Products
* 🗑️ Delete Products
* 📦 Manage Orders
* 📈 Seller-side Marketplace Management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* JavaScript
* Axios

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB

### Authentication & Security
🔐 JWT-based Authentication
🔑 Email/Password Authentication with bcrypt
🔵 Google OAuth Authentication
👤 Buyer & Seller Authentication
🛡️ Protected Routes
* bcrypt

### Image Management

* ImageKit

### Payment

* Payment Gateway Integration



## 🏗️ Project Architecture

```text
                    E-Commerce Marketplace
                            │
              ┌─────────────┴─────────────┐
              │                           │
           Buyer                       Seller
              │                           │
       ┌──────┴──────┐             ┌──────┴──────┐
       │             │             │             │
    Products       Cart        Dashboard      Products
       │             │             │             │
       └──────┬──────┘             └──────┬──────┘
              │                           │
          Address                     Orders
              │
           Checkout
              │
        Payment Gateway
              │
             API
              │
        Express + Node.js
              │
           MongoDB


If you found this project useful, consider giving the repository a ⭐ on GitHub.
