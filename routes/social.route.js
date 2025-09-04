const express = require("express")
const router = express.Router()
const Social = require("../models/social.model")

router.post("/", async (req, res) => {
    try {
        const { social_name, social_icon_file } = req.body

        if (!social_name || !social_icon_file) {
            return res.status(400).json({ message: "Social name and icon file are required" })
        }

        const existingSocial = await Social.findOne({ where: { social_name } })
        if (existingSocial) {
            return res.status(400).json({ message: "Social platform already exists" })
        }

        const newSocial = await Social.create({
            social_name,
            social_icon_file
        })

        res.status(201).json(newSocial)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const socials = await Social.findAll()
        res.json(socials)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const social = await Social.findByPk(id)

        if (!social) {
            return res.status(404).json({ message: "Social platform not found" })
        }

        res.json(social)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { social_name, social_icon_file } = req.body

        const social = await Social.findByPk(id)
        if (!social) {
            return res.status(404).json({ message: "Social platform not found" })
        }

        if (social_name && social_name !== social.social_name) {
            const existingSocial = await Social.findOne({ where: { social_name } })
            if (existingSocial) {
                return res.status(400).json({ message: "Social platform already exists" })
            }
        }

        await social.update({
            social_name,
            social_icon_file
        })

        res.json(social)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Social.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).json({ message: "Social platform not found" })
        }

        res.json({ message: "Social platform deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

module.exports = router