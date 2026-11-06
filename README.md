# Frontend E-Commerce Project 🛍️

A modern, responsive, and interactive frontend e-commerce web application built using **React 19**, **React Bootstrap**, **Redux Toolkit**, and integrated with the **DummyJSON API**.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Integration](#api-integration)
- [Test Credentials](#test-credentials)

---

## 🌟 Project Overview
This project satisfies all requirements specified in the Frontend E-Commerce Project Specification:
- **Authentication**: Login & Register with token persistence in `localStorage`, auto-login detection, protected routes, and profile management.
- **Product Catalog**: Browsing, live search, multi-category filtering, multi-criteria sorting, and pagination with limit & skip.
- **Product Details**: Multi-image preview gallery, real-time discount savings calculation, detailed specs, reviews, and quantity selector.
- **Cart Management**: Offline persistence, quantity modification, coupon codes (`SAVE10`, `SAVE20`), free shipping progress bar, interactive checkout modal, and API carts explorer.
- **Admin Dashboard**: Real-time KPI summary widgets, full CRUD operations for Products, Users management table with search and view modals, and Carts database inspection.
- **Theme**: Dark and Light mode toggle with persistent state.

---

## 📂 Project Architecture

```
src/
├── assets/
├── components/
│   ├── Footer/
│   │   └── Footer.jsx
│   ├── Cart.jsx
│   ├── CategoryList.jsx
│   ├── GlobalNavbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductDetails.jsx
│   ├── Products.jsx
│   ├── ProtectedRoute.jsx
│   └── Dashboard/
│       ├── ProductsTable.jsx
│       ├── UsersTable.jsx
│       └── Modals/
│           ├── CartForm.jsx
│           └── ProductForm.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   └── Dashboard.jsx
├── store/
│   ├── Slices/
│   │   ├── cartSlice.js
│   │   ├── productsSlice.js
│   │   ├── themeSlice.js
│   │   └── usersSlice.js
│   └── store.js
└── utils/
    └── ErrorHandling.jsx
```

---

## 🛠️ Tech Stack
- **Framework & Runtime**: React 19, Vite
- **UI & Components**: React Bootstrap 2.10, Bootstrap 5.3
- **Icons**: React Icons (FontAwesome, Material Design, AntDesign)
- **State Management**: Redux Toolkit 2.13 (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM 7 (`react-router-dom`)
- **HTTP Client**: Axios
- **Typography**: Google Fonts (Plus Jakarta Sans)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <your-repository-url>

# Navigate into the project folder
cd E-Commerce-B

# Install dependencies
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Test Credentials (Quick Login)
You can use the one-click demo login buttons on the `/login` page or use the following DummyJSON credentials:

| Role | Username | Password |
|---|---|---|
| Admin | `emilys` | `emilyspass` |
| Customer | `averyp` | `averyppass` |

---

## 🌐 API Integration (DummyJSON)
- **Auth**: `POST /auth/login`, `GET /auth/me`
- **Products**: `GET /products`, `GET /products/search`, `GET /products/category/{cat}`, `GET /products/{id}`, `POST /products/add`, `PUT /products/{id}`, `DELETE /products/{id}`
- **Categories**: `GET /products/categories`
- **Carts**: `GET /carts`, `GET /carts/user/{id}`, `POST /carts/add`
- **Users**: `GET /users`, `GET /users/search`, `POST /users/add`, `DELETE /users/{id}`
