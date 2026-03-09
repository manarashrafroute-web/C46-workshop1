import { Sequelize } from "sequelize";


export const sequelize_config = new Sequelize("sequelize", "root", "", {
    host: 'localhost',
    dialect: 'mysql',
    //logging:(log)=>console.log('Database logger: ' , log)

})

export const dbConnection = async () => {
    try {
        await sequelize_config.authenticate()
       // await sequelize_config.sync({alter:true, force:true});
        console.log('Database connection has been established successfully.');

    } catch (error) {
        console.log(error);
    }
} 