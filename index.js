const app = require("express")()
const appRouter = require("./app")
const PORT = process.env.PORT || 3000

app.use(require("express").json())
app.use("/api/v1", appRouter)
app.use(function(req, res) {
    return res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}`)
})