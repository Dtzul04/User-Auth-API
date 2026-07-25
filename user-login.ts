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
    // Extract user data from request body
})

app.post("/login", async (req, res) => {
    // Extract email and password from request body
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
