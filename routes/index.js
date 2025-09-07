const router = require("express").Router()

const authorRouter = require("./author.route")
const socialRouter = require("./social.route")
const authorSocialRouter = require("./author_social.route")
const authRouter = require("./auth.route") 

router.use("/auth", authRouter) 
router.use("/author", authorRouter)
router.use("/social", socialRouter)
router.use("/author-social", authorSocialRouter)

module.exports = router