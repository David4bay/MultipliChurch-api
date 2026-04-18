const bcrypt = require("bcrypt")
const db = require("../db/db")
const jwt = require("jsonwebtoken")

async function login(req, res) {
    const request = req.body

    try {
        if (!request.username || !request.password) {
            return res.status(400).json({ message: "Username and password are required" })
        }

        const user = await db.asyncGet("SELECT * FROM user WHERE username = ?", [request.username])

        if (!user) {
            return res.status(401).json({ message: "Invalid username" })
        }

        const isPasswordValid = await bcrypt.compare(request.password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(200).json({ message: "Login successful", token })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function signup(req, res) {
    const request = req.body

    try {
        if (!request.username || !request.password || !request.role) {
            return res.status(400).json({ message: "Username, password and role are required" })
        }

        if (request.role !== "admin" && request.role !== "member") {
            return res.status(400).json({ message: "Role must be either admin or member" })
        }

        // Check for existing user first, before hashing
        const existingUser = await db.asyncGet("SELECT id FROM user WHERE username = ?", [request.username])

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(request.password, 10)
        const isAdmin = request.role === "admin" ? 1 : 0

        await db.asyncRun(
            "INSERT INTO user (username, password, isAdmin) VALUES (?, ?, ?)",
            [request.username, hashedPassword, isAdmin]
        )

        return res.status(201).json({ message: "User created successfully" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { login, signup }