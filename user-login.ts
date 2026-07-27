import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

//Initialize Express application
const app = express();
// Set port
const port = process.env.PORT || 3000;
// Initialize PostgreSQL pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432
})

// Middleware to parse JSON bodies
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the user login API");
})

app.post("/register", async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required"});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into database
    const result = await pool.query(
        `INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, created_at`,
        [email, hashedPassword]
        // Return success response
    ); return res.status(201).json({
        message: "User registered",
        user: result.rows[0],
    });
})

app.post("/login", async (req, res) => {
    // Extract email and password from request body
    const { email, password} = req.body;

    // Retrieve user from database
     const { rows } = await pool.query(
        `SELECT id, email, password_hash
        FROM users
        WHERE email = $1
        `, [email]
    ); 

    const user = rows[0];
    
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password"});
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    // STEP #3
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
