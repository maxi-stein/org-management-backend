# Organizational Chart Management - Backend

## 🚀 Overview

This is the backend server for the Org Management System, a powerful Node.js and Express-based API designed to support organizational management operations. It provides a comprehensive suite of endpoints for managing users, positions, departments, and areas within a company.

This project is forked from the basic API created by Gastón Larriera, which laid the groundwork by providing an initial setup with JWT-based authentication and some basic configuration middleware. From there, business logic and additional features were implemented to expand the system's functionality.

## 🌟 Key Features

- **User Management**: CRUD operations for user accounts
- **Role-based Access Control**: Admin and Employee roles
- **Position Management**: Manage job positions within the organization
- **Department and Area Management**: Organize company structure
- **JWT Authentication**: Secure login system integrated
- **Database Migrations**: Easy database schema management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Logging**: Winston (implied from logger configuration)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (LTS version is recommended) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download here](https://www.mongodb.com/try/download/community)

## Getting Started

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Run migrations (to set up the database schema): `npm run migrate up`
4. Run the development server: `npm run dev`
5. **Configuration:**  
   This project uses a `development.json` file for configuration, so you **don't need to create a `.env` file**.  
   The `development.json` file provided in this repository contains the environment configuration such as the server URL, database connection, JWT settings, and more.

## ❗Error Handling

API errors are logged in the `api-errors.log` file located in the root directory. The file records error messages and stack traces for debugging.

## 🔐 Authentication

This application uses **JWT (JSON Web Token)** for authentication. The login system is already integrated with the backend, providing secure access to protected routes and features.

## 👨‍💻 Acknowledgements

This project was forked from **Gastón Larriera's** base API, which provided the initial setup, middleware configuration, and JWT authentication logic.
