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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/login", login)
app.post("/signup", signup)

app.get("/churches", requireAuth, getChurches)
app.get("/churches/:id", requireAuth, getChurchById)
app.put("/churches/:id", requireAuth, requireAdmin, updateChurch)
app.post("/churches", requireAuth, requireAdmin, createChurch)
app.delete("/churches/:id", requireAuth, requireAdmin, deleteChurch)

app.get("/churches/:churchId/members", requireAuth, getMembers)
app.get("/churches/:churchId/members/:id", requireAuth, getMemberById)
app.put("/churches/:churchId/members/:id", requireAuth, requireAdmin, updateMember)
// removed the requireAdmin middleware from /churches/:churchId/members so normal users can be members
app.post("/churches/:churchId/members", requireAuth, createMember)
app.delete("/churches/:churchId/members/:id", requireAuth, requireAdmin, removeMember)

module.exports = app;