const express = require("express")
const cors = require("cors");
const { login, signup } = require("./controllers/auth");
const app = express()
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3000


app.use(cors())
app.use(express.json())

app.get("/login", login)
app.post("/signup", signup)
app.get("/churches", getChurches)
app.post("/churches", createChurch)
app.get("/churches/:id", getChurchById)
app.put("/churches/:id", updateChurch)
app.delete("/churches/:id", deleteChurch)


app.listen(PORT, function() {
    console.log(`App running on port ${PORT}`)
})