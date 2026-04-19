const bcrypt = require("bcrypt")
const db = require("../db/db")
const jwt = require("jsonwebtoken")

async function login(req, res) {
    const request = req.body

    console.log("Login request received:", request)
    try {
        if (!request.username || !request.password) {
            return res.status(400).json({ message: "Username and password are required" })
        }

        const user = await db.asyncGet("SELECT * FROM user WHERE username = ?", [request.username])

        console.log("User found in database:", user)
        if (!user) {
            return res.status(401).json({ message: "Invalid username" })
        }

        const isPasswordValid = await bcrypt.compare(request.password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { 
                id: user.id, username: user.username, 
                role: user.isAdmin ? "admin" : "member" 
            },
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

    console.log("Signup request received:", request)
    try {
        if (!request.username || !request.password || !request.role) {
            return res.status(400).json({ message: "Username, password and role are required" })
        }

        if (request.role !== "admin" && request.role !== "member") {
            return res.status(400).json({ message: "Role must be either admin or member" })
        }

        console.log("Signup request received:", request)
        const existingUser = await db.asyncGet("SELECT id FROM user WHERE username = ?", [request.username])

        if (existingUser) {
            console.log("User already exists with username:", request.username)
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(request.password, 10)
        const isAdmin = request.role === "admin" ? 1 : 0

        const user = await db.asyncRun(
            "INSERT INTO user (username, password, isAdmin) VALUES (?, ?, ?)",
            [request.username, hashedPassword, isAdmin]
        )

        const userInfo = await db.asyncGet("SELECT * FROM user WHERE id = ?", [user.lastID])
    
        const token = jwt.sign(
            { 
                id: userInfo.id, username: userInfo.username, 
                role: userInfo.isAdmin ? "admin" : "member" 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(201).json({ message: "success", token })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { login, signup }