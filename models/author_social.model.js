const sequelize = require("../config/db")
const { DataTypes } = require("sequelize")

const AuthorSocial = sequelize.define("AuthorSocial", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author_id: {
        type: DataTypes.INTEGER,  
        allowNull: false,
    },
    social_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    social_link: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
}, {
    tableName: "author_social",
    timestamps: true
})

module.exports = AuthorSocial