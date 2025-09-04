const sequelize = require("../config/db")
const { DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")

const Author = sequelize.define("Author", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    author_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    author_nick_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 30]
        }
    },
    author_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    author_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [9, 15]
        }
    },
    author_password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    author_info: {
        type: DataTypes.TEXT, 
    },
    author_position: {
        type: DataTypes.STRING,
    },
    author_photo: {
        type: DataTypes.STRING, 
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "authors",
    timestamps: true,
    hooks: {
        beforeCreate: async (author) => {
            if (author.author_password) {
                const salt = await bcrypt.genSalt(10);
                author.author_password = await bcrypt.hash(author.author_password, salt);
            }
        },
        beforeUpdate: async (author) => {
            if (author.changed('author_password')) {
                const salt = await bcrypt.genSalt(10);
                author.author_password = await bcrypt.hash(author.author_password, salt);
            }
        }
    }
})

Author.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.author_password);
}

module.exports = Author