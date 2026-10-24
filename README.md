# SecureHub - Login & Profile Authentication

SecureHub is a full-stack authentication application built using Node.js, Express.js, PostgreSQL, bcrypt, express-session, HTML, CSS, and JavaScript.

The application allows users to register, securely log in, view their protected profile, and log out.

## Features

- User registration
- User login
- Password hashing using bcrypt
- Session-based authentication
- Protected profile page
- User logout
- PostgreSQL database
- Client-side validation
- Server-side validation
- Duplicate email validation
- Responsive dark-themed UI
- Secure environment variable configuration

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- pg
- bcrypt
- express-session
- dotenv

## Project Structure

task-6-login-profile/
│
├── public/
│   ├── index.html
│   ├── register.html
│   ├── profile.html
│   └── style.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── schema.sql
├── server.js
└── README.md

## Database

Database Name:

task6_auth

Table Name:

users

The users table contains:

- id
- name
- email
- password
- created_at

Passwords are stored as bcrypt hashes rather than plain text.

## API Endpoints

### Register

POST /api/register

Creates a new user account.

### Login

POST /api/login

Authenticates a user and creates a session.

### Profile

GET /api/profile

Returns the currently logged-in user's profile.

This route requires authentication.

### Logout

POST /api/logout

Destroys the current user session.

## Validation

The application validates:

- Name is required.
- Email must be valid.
- Password must meet the required length.
- Password confirmation must match.
- Duplicate email addresses are rejected.
- Login requires valid credentials.
- Protected profile access requires an active session.

## Installation

### 1. Install Dependencies

Open a terminal inside the project folder and run:

npm install

### 2. Configure Environment Variables

Create a `.env` file with your PostgreSQL configuration.

Example:

DB_USER=postgres
DB_HOST=localhost
DB_NAME=task6_auth
DB_PASSWORD=your_password
DB_PORT=5432
SESSION_SECRET=your_session_secret

Do not upload the `.env` file to GitHub.

### 3. Start the Server

Run:

node server.js

The server will run at:

http://localhost:3000

### 4. Open the Application

Open:

http://localhost:3000

## Authentication Flow

Registration
↓
Password Hashing
↓
PostgreSQL Database
↓
Login
↓
Session Created
↓
Protected Profile
↓
Logout
↓
Session Destroyed

## Security

- Passwords are hashed using bcrypt.
- Sessions are used for authentication.
- Protected profile data requires an active session.
- Parameterized SQL queries are used.
- `.env` is excluded using `.gitignore`.
- Real database credentials are not included in the repository.

## Database Schema

The SQL commands required to create the database and users table are available in:

schema.sql

## Internship Task

This project was developed as part of the SAN Web Technology Full-Stack Development Internship.

## Author

BCA Full-Stack Development Internship Project