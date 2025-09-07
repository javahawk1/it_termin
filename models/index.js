const Author = require("./author.model")
const Social = require("./social.model")
const Author_Social = require("./author_social.model")

Author.hasMany(Author_Social, { foreignKey: "author_id" })
Social.hasMany(Author_Social, { foreignKey: "social_id" })

Author_Social.belongsTo(Author, { foreignKey: "author_id" })
Author_Social.belongsTo(Social, { foreignKey: "social_id" })


module.exports = { Author, Social, Author_Social }