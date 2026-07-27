import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
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

// Register route
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

// Login route
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
    
    // Check if user exists
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password"});
    }

    // Check if password matches
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    // Check if password does not match
    if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password"})
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET as string, { expiresIn: "1hr"});
    return res.status(200).json({
        message: "Login successful",
        token,
    });
})

interface AuthReqest extends Request {
    user?: { userId: string };
}

// Middleware to require authentication
function requireAuth(req: AuthReqest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    // Check if header starts with "Bearer "
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized"});
    }

    const token = header.split(" ")[1];

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as { userId: string };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token"});
    }
}

// Protected route to get user information 
app.get("/me", requireAuth, async (req: AuthReqest, res: Response) => {
    // Get user ID from token
    const userId = req.user?.userId;

    // Get user from database
    const result = await pool.query(
        `SELECT id, email, created_at FROM users WHERE id = $1`,
        [userId]
    );

    return res.json({ user: result.rows[0] });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
