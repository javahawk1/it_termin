const express = require("express")
const router = express.Router()
const AuthorSocial = require("../models/author_social.model")
const Author = require("../models/author.model")
const Social = require("../models/social.model")

router.post("/", async (req, res) => {
    try {
        const { author_id, social_id, social_link } = req.body

        if (!author_id || !social_id || !social_link) {
            return res.status(400).json({ message: "Author ID, Social ID, and Social link are required" })
        }

        const author = await Author.findByPk(author_id)
        if (!author) {
            return res.status(404).json({ message: "Author not found" })
        }

        const social = await Social.findByPk(social_id)
        if (!social) {
            return res.status(404).json({ message: "Social platform not found" })
        }

        const existingConnection = await AuthorSocial.findOne({
            where: { author_id, social_id }
        })
        if (existingConnection) {
            return res.status(400).json({ message: "This social connection already exists for the author" })
        }

        const newConnection = await AuthorSocial.create({
            author_id,
            social_id,
            social_link
        })

        const result = await AuthorSocial.findByPk(newConnection.id, {
            include: [
                { 
                    model: Author, 
                    as: "author",
                    attributes: ['id', 'author_first_name', 'author_last_name', 'author_nick_name'] 
                },
                { 
                    model: Social, 
                    as: "social",
                    attributes: ['id', 'social_name', 'social_icon_file'] 
                }
            ]
        })

        res.status(201).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const connections = await AuthorSocial.findAll({
            include: [
                { 
                    model: Author, 
                    as: "author",
                    attributes: ['id', 'author_first_name', 'author_last_name', 'author_nick_name'] 
                },
                { 
                    model: Social, 
                    as: "social",
                    attributes: ['id', 'social_name', 'social_icon_file'] 
                }
            ]
        })
        res.json(connections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get("/author/:author_id", async (req, res) => {
    try {
        const { author_id } = req.params
        const connections = await AuthorSocial.findAll({
            where: { author_id },
            include: [
                { 
                    model: Social, 
                    as: "social",
                    attributes: ['id', 'social_name', 'social_icon_file'] 
                }
            ]
        })
        res.json(connections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { social_link } = req.body

        if (!social_link) {
            return res.status(400).json({ message: "Social link is required" })
        }

        const connection = await AuthorSocial.findByPk(id)
        if (!connection) {
            return res.status(404).json({ message: "Connection not found" })
        }

        await connection.update({ social_link })

        const updatedConnection = await AuthorSocial.findByPk(id, {
            include: [
                { 
                    model: Author, 
                    as: "author",
                    attributes: ['id', 'author_first_name', 'author_last_name'] 
                },
                { 
                    model: Social, 
                    as: "social",
                    attributes: ['id', 'social_name'] 
                }
            ]
        })

        res.json(updatedConnection)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await AuthorSocial.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).json({ message: "Connection not found" })
        }

        res.json({ message: "Connection deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

module.exports = router