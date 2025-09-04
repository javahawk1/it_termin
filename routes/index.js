const express = require("express")
const router = express.Router()

const authorRoutes = require("./author.route")
const socialRoutes = require("./social.route")
const authorSocialRoutes = require("./authorSocial.route")
const authRoutes = require("./auth.route")

router.use("/authors", authorRoutes)
router.use("/socials", socialRoutes)
router.use("/author-socials", authorSocialRoutes)
router.use("/auth", authRoutes)

router.get("/health", (req, res) => {
    res.status(200).json({ 
        message: "Server is running",
        timestamp: new Date().toISOString()
    })
})

module.exports = router