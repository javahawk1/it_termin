const express = require("express")
const router = express.Router()
const Author = require("../models/author.model")
const AuthorSocial = require("../models/author_social.model")
const Social = require("../models/social.model")

router.post("/", async (req, res) => {
    try {
        const {
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password,
            author_info,
            author_position,
            author_photo
        } = req.body

        if (!author_first_name || !author_last_name || !author_nick_name || 
            !author_email || !author_phone || !author_password) {
            return res.status(400).json({ message: "Barcha majburiy maydonlarni to'ldiring" })
        }

        const existingNick = await Author.findOne({ where: { author_nick_name } })
        if (existingNick) return res.status(400).json({ message: "Bu taxallus allaqachon mavjud" })

        const existingEmail = await Author.findOne({ where: { author_email } })
        if (existingEmail) return res.status(400).json({ message: "Bu email allaqachon mavjud" })

        const existingPhone = await Author.findOne({ where: { author_phone } })
        if (existingPhone) return res.status(400).json({ message: "Bu telefon raqami allaqachon mavjud" })

        const newAuthor = await Author.create({
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password,
            author_info,
            author_position,
            author_photo
        })

        const authorResponse = newAuthor.toJSON()
        delete authorResponse.author_password

        res.status(201).json(authorResponse)
    } catch (error) {
        console.error("Xato yangi author yaratishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { author_email, author_password } = req.body

        if (!author_email || !author_password) {
            return res.status(400).json({ message: "Email va parol majburiy" })
        }

        const author = await Author.findOne({ 
            where: { author_email },
        })

        if (!author) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri" })
        }

        const isValidPassword = await author.validatePassword(author_password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri" })
        }

        const authorResponse = author.toJSON()
        delete authorResponse.author_password

        res.json({
            message: "Muvaffaqiyatli kirish",
            author: authorResponse
        })
    } catch (error) {
        console.error("Xato login qilishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const authors = await Author.findAll({
            include: [{
                model: AuthorSocial,
                as: "social_connections",
                include: [{
                    model: Social,
                    as: "social",
                    attributes: ['social_name', 'social_icon_file']
                }]
            }]
        })
        res.json(authors)
    } catch (error) {
        console.error("Xato authorlarni olishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const author = await Author.findByPk(id, {
            attributes: { exclude: ['author_password'] },
            include: [{
                model: AuthorSocial,
                as: "social_connections",
                include: [{
                    model: Social,
                    as: "social",
                    attributes: ['social_name', 'social_icon_file']
                }]
            }]
        })

        if (!author) return res.status(404).json({ message: "Author topilmadi" })

        res.json(author)
    } catch (error) {
        console.error("Xato authorni olishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const {
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password,
            author_info,
            author_position,
            author_photo
        } = req.body

        const author = await Author.findByPk(id)
        if (!author) return res.status(404).json({ message: "Author topilmadi" })

        if (author_nick_name && author_nick_name !== author.author_nick_name) {
            const existingNick = await Author.findOne({ where: { author_nick_name } })
            if (existingNick) return res.status(400).json({ message: "Bu taxallus allaqachon mavjud" })
        }

        if (author_email && author_email !== author.author_email) {
            const existingEmail = await Author.findOne({ where: { author_email } })
            if (existingEmail) return res.status(400).json({ message: "Bu email allaqachon mavjud" })
        }

        if (author_phone && author_phone !== author.author_phone) {
            const existingPhone = await Author.findOne({ where: { author_phone } })
            if (existingPhone) return res.status(400).json({ message: "Bu telefon raqami allaqachon mavjud" })
        }

        await author.update({
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_info,
            author_position,
            author_photo
        })

        const updatedAuthor = await Author.findByPk(id, {
            attributes: { exclude: ['author_password'] }
        })

        res.json(updatedAuthor)
    } catch (error) {
        console.error("Xato authorni yangilashda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        
        await AuthorSocial.destroy({ where: { author_id: id } })
        
        const deleted = await Author.destroy({ where: { id } })

        if (!deleted) return res.status(404).json({ message: "Author topilmadi" })

        res.json({ message: "Author va uning social connectionslari o'chirildi" })
    } catch (error) {
        console.error("Xato authorni o'chirishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

router.post("/:id/validate-password", async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        if (!password) {
            return res.status(400).json({ message: "Parol majburiy" })
        }

        const author = await Author.findByPk(id, {
            attributes: { include: ['author_password'] }
        })

        if (!author) {
            return res.status(404).json({ message: "Author topilmadi" })
        }

        const isValid = await author.validatePassword(password)
        res.json({ isValid })
    } catch (error) {
        console.error("Xato parolni tekshirishda:", error)
        res.status(500).json({ message: "Server xatosi", error: error.message })
    }
})

module.exports = router