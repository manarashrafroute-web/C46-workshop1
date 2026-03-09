import { DataTypes } from "sequelize";
import { sequelize_config } from "../connection.js";
import Note from "./note.model.js";

// id , int , pri , aut
const User = sequelize_config.define(
    'User',
    {
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                len: [2, 30],
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            // unique:'email_unique',
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                checkPasswordLength(value) {
                    if (value.length < 6) {
                        throw new Error('password must be greater than 6')
                    }
                }
            }
        },

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
            validate: {
                isIn: [['user', 'admin']]
            }
        }
    },
    {
        timestamps: true,
        paranoid :true , 
        indexes:
            [
                {
                    name: 'idx_email_unique',
                    unique: true,
                    fields: ['email']
                }
            ],
        hooks: {
            beforeCreate: (user, options) => {
                User.checkNameLength(user)
            }
        }
    }
)

User.checkNameLength = (user) => {
    if (!user.name || user.name.length <= 2) {

        throw new Error('userName must be greater than 2')
    }
}



export default User

User.hasMany(Note, {
    foreignKey: { name: 'userId' },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "notes"
})

Note.belongsTo(User, {
    foreignKey: { name: 'userId' },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "user"
})