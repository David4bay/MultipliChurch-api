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
    updateMember
 } = require("./controllers/members");

 const express = require("express");
const app = express.Router();
const sqlite3 = require('sqlite3').verbose();

app.use(cors())
app.use(express.json())

app.get("/login", login)
app.post("/signup", signup)

app.get("/churches", getChurches)
app.get("/churches/:id", getChurchById)
app.put("/churches/:id", updateChurch)
app.post("/churches", createChurch)
app.delete("/churches/:id", deleteChurch)

app.get("/members", getMembers)
app.get("/members/:id", getMemberById)
app.put("/members/:id", updateMember)
app.delete("/members/:id", removeMember)

module.exports = app;