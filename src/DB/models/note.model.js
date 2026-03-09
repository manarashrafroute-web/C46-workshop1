import { DataTypes, Model } from "sequelize";
import { sequelize_config } from "../connection.js";


class Note extends Model { }

Note.init({
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    userId: {

        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize_config,
    modelName: 'Note',
    tableName: 'Notes',
    timestamps: true,
    paranoid: true
}

)


export default Note

