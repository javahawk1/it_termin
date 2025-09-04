const Author = require("./author.model")
const Social = require("./social.model")
const AuthorSocial = require("./author_social.model")

Author.hasMany(AuthorSocial, { 
    foreignKey: "author_id",
    as: "social_connections",
    onDelete: 'CASCADE'
})

AuthorSocial.belongsTo(Author, { 
    foreignKey: "author_id",
    as: "author"
})

Social.hasMany(AuthorSocial, { 
    foreignKey: "social_id",
    as: "author_connections",
    onDelete: 'CASCADE'
})

AuthorSocial.belongsTo(Social, { 
    foreignKey: "social_id",
    as: "social"
})

module.exports = { Author, Social, AuthorSocial }