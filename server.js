const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));

// Test PostgreSQL connection
pool.connect()
    .then(client => {
        console.log("PostgreSQL connected successfully.");
        client.release();
    })
    .catch(error => {
        console.error(
            "PostgreSQL connection failed:",
            error.message
        );
    });

// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters."
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email.trim().toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                hashedPassword
            ]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to register user."
        });
    }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        req.session.userId = user.id;

        res.json({
            success: true,
            message: "Login successful."
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to login."
        });
    }
});

// ===============================
// PROFILE
// ===============================

app.get("/api/profile", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        const result = await pool.query(
            `SELECT id, name, email, created_at
             FROM users
             WHERE id = $1`,
            [req.session.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load profile."
        });
    }
});

// ===============================
// LOGOUT
// ===============================

app.post("/api/logout", (req, res) => {
    req.session.destroy(error => {

        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });
        }

        res.json({
            success: true,
            message: "Logout successful."
        });
    });
});

// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});