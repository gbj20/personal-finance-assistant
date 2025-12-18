


const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running successfully 🚀" });
});


// ================== DATABASE ==================
const db = new sqlite3.Database(path.join(__dirname, "users.db"), (err) => {
    if (err) console.error("❌ DB Connection Error:", err.message);
    else console.log("✅ Connected to SQLite DB");
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

// ================== AUTH MIDDLEWARE ==================
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    jwt.verify(token, "secret123", (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid or expired token" });
        req.userId = decoded.id;
        next();
    });
}

// ================== API ROUTES ==================

// Signup
app.post("/signup", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
        [firstName, lastName, email, hashedPassword],
        function (err) {
            if (err) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
            res.json({ success: true, message: "User registered successfully" });
        }
    );
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user.id }, "secret123", { expiresIn: "1h" });

        res.json({
            success: true,
            token,
            user: { name: `${user.firstName} ${user.lastName}`, email: user.email },
        });
    });
});

// ✅ Get logged-in user profile (works with token)
app.get("/api/user", authenticateToken, (req, res) => {
    db.get(
        `SELECT id, firstName, lastName, email FROM users WHERE id = ?`,
        [req.userId],
        (err, user) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            res.json({
                success: true,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email, // email is returned but not editable
                    name: `${user.firstName} ${user.lastName}`,
                },
            });
        }
    );
});

// ✅ Update profile (firstName, lastName only)
app.post("/api/update-profile", authenticateToken, (req, res) => {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        return res.status(400).json({ success: false, message: "First name and Last name are required" });
    }

    db.run(
        `UPDATE users SET firstName = ?, lastName = ? WHERE id = ?`,
        [firstName, lastName, req.userId],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            res.json({ success: true, message: "Profile updated successfully" });
        }
    );
});

// ✅ Change password
app.post("/api/change-password", authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Both currentPassword and newPassword are required" });
    }

    db.get(`SELECT password FROM users WHERE id = ?`, [req.userId], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!row) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = bcrypt.compareSync(currentPassword, row.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

        const hashed = bcrypt.hashSync(newPassword, 10);
        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashed, req.userId], function (err) {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            res.json({ success: true, message: "Password changed successfully" });
        });
    });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
