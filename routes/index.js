const express = require("express")
const router = express.Router()

const authorRoutes = require("./author.route")
const socialRoutes = require("./social.route")
const authorSocialRoutes = require("./authorSocial.route")

router.use("/authors", authorRoutes)
router.use("/socials", socialRoutes)
router.use("/author-socials", authorSocialRoutes)

module.exports = router