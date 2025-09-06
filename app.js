const express = require("express")
const config = require("config")
const sequelize = require("./config/db")
const cookieParser = require("cookie-parser")
const cors = require("cors")

require("./models/associations")

const mainRouter = require("./routes")

const PORT = config.get("port") ?? 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser()) 

app.use("/api", mainRouter)

app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).json({ message: "Server error", error: error.message })
})

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

const start = async () => {
    try {
        await sequelize.authenticate()
        
        await sequelize.sync({ alter: true })
        
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`)
        })
    } catch (err) {
        console.error("Database connection failed:", err)
        process.exit(1)
    }
}

start()