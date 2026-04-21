require('dotenv').config();
const cors = require("cors");
const { 
    login, 
    signup 
} = require("./controllers/auth");
const { 
    getChurches, 
    createChurch, 
    getChurchById, 
    updateChurch, 
    deleteChurch 
} = require("./controllers/churches");
const { 
    getMembers, 
    getMemberById, 
    removeMember, 
    updateMember,
    createMember
 } = require("./controllers/members");

const { requireAuth, requireAdmin } = require("./middleware/auth.middleware");


const express = require("express");
const app = express.Router();
const sqlite3 = require('sqlite3').verbose();
const swaggerjsdoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")
const swaggerOptions = require("./config/swaggerConfig")
const swaggerDocs = swaggerjsdoc(swaggerOptions)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocs))

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login as a user or admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: david123
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
app.post("/login", login)

/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user or admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username:
 *                 type: string
 *                 example: david123
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *                 example: member
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Internal server error
 */
app.post("/signup", signup)

/**
 * @swagger
 * /churches:
 *   get:
 *     tags: [Churches]
 *     summary: Get all churches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all churches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Grace Chapel
 *                   total_members:
 *                     type: integer
 *                     example: 42
 *                   admin:
 *                     type: string
 *                     example: david123
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.get("/churches", requireAuth, getChurches)

/**
 * @swagger
 * /churches/{id}:
 *   get:
 *     tags: [Churches]
 *     summary: Get a church by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Church found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 total_members:
 *                   type: integer
 *                 admin:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Church not found
 *       500:
 *         description: Internal server error
 */
app.get("/churches/:id", requireAuth, getChurchById)

/**
 * @swagger
 * /churches/{id}:
 *   put:
 *     tags: [Churches]
 *     summary: Update a church by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Church Name
 *     responses:
 *       200:
 *         description: Church updated successfully
 *       400:
 *         description: Church name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Church not found
 *       500:
 *         description: Internal server error
 */
app.put("/churches/:id", requireAuth, requireAdmin, updateChurch)

/**
 * @swagger
 * /churches:
 *   post:
 *     tags: [Churches]
 *     summary: Create a new church (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kingdom Hearts Church
 *     responses:
 *       201:
 *         description: Church created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Church created successfully
 *                 id:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Church name required or already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin privileges required
 *       500:
 *         description: Internal server error
 */
app.post("/churches", requireAuth, requireAdmin, createChurch)

/**
 * @swagger
 * /churches/{id}:
 *   delete:
 *     tags: [Churches]
 *     summary: Delete a church by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Church deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Church not found
 *       500:
 *         description: Internal server error
 */
app.delete("/churches/:id", requireAuth, requireAdmin, deleteChurch)

/**
 * @swagger
 * /churches/{churchId}/members:
 *   get:
 *     tags: [Members]
 *     summary: Get all members of a church
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: churchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   isAdmin:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Church not found
 *       500:
 *         description: Internal server error
 */
app.get("/churches/:churchId/members", requireAuth, getMembers)

/**
 * @swagger
 * /churches/{churchId}/members/{id}:
 *   get:
 *     tags: [Members]
 *     summary: Get a specific member of a church
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: churchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Member found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
app.get("/churches/:churchId/members/:id", requireAuth, getMemberById)

/**
 * @swagger
 * /churches/{churchId}/members/{id}:
 *   put:
 *     tags: [Members]
 *     summary: Move a member to a different church (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: churchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_church_id]
 *             properties:
 *               new_church_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: new_church_id is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: Member or target church not found
 *       500:
 *         description: Internal server error
 */
app.put("/churches/:churchId/members/:id", requireAuth, requireAdmin, updateMember)

/**
 * @swagger
 * /churches/{churchId}/members:
 *   post:
 *     tags: [Members]
 *     summary: Join a church (any authenticated user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: churchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member added successfully
 *                 id:
 *                   type: integer
 *                   example: 7
 *       400:
 *         description: user_id required or user already a member
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Church or user not found
 *       500:
 *         description: Internal server error
 */
app.post("/churches/:churchId/members", requireAuth, createMember)

/**
 * @swagger
 * /churches/{churchId}/members/{id}:
 *   delete:
 *     tags: [Members]
 *     summary: Remove a member from a church (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: churchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
app.delete("/churches/:churchId/members/:id", requireAuth, requireAdmin, removeMember)

module.exports = app;