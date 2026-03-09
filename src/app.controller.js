import express from "express";
import { dbConnection } from "./DB/connection.js";
import userController from "./module/Users/user.controller.js";
import noteController from "./module/Notes/note.controller.js";


export default () => {

    let app = express();

    app.use(express.json()) // baffer to object


    app.use('/users', userController)
    app.use('/notes', noteController)


    dbConnection()

    app.use((req, res, next) => {
        res.status(404).json({
            message: "Router not found"
        })
    })

    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        })
    })

    var x = 5
    console.log(x);


    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

}