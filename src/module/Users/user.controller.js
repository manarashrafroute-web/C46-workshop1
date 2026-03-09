import { Router } from "express";

import * as userServices from "./Services/user.service.js";
import User from "../../DB/models/user.model.js";

const userController = Router();


userController.post('/register', async (req, res) => {
    try {
        const data = await userServices.RegistrationService(req.body)

        console.log({ data });


        if (data == "userExists") {
            return res.status(409).json({
                message: "user already exists"
            })
        }

        return res.status(201).json({ message: "sucess", data })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
})


// 2. UPDATE USER (PUT) - /user/:id
userController.put('/:id', async (req, res) => {
    try {
        const result = await userServices.UpdateUserService(req.params.id, req.body)

        if (result === "userNotFound") {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (result === "emailExists") {
            return res.status(409).json({
                message: "Email already exists"
            })
        }

        return res.status(200).json({
            message: "User updated successfully",
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})


// 3. SOFT DELETE USER (DELETE) - /user/:id
userController.delete('/:id', async (req, res) => {
    try {
        const result = await userServices.DeleteUserService(req.params.id)

        if (result === "userNotFound") {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})


// 4. RESTORE DELETED USER (PATCH) - /user/restore/:id
userController.patch('/restore/:id', async (req, res) => {
    try {
        const result = await userServices.RestoreUserService(req.params.id)

        if (result === "userNotFound") {
            return res.status(404).json({
                message: "User not found or not deleted"
            })
        }

        return res.status(200).json({
            message: "User restored successfully",
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})


// 5. PERMANENTLY DELETE USER (DELETE) - /user/hard/:id
userController.delete('/hard/:id', async (req, res) => {
    try {
        const result = await userServices.HardDeleteUserService(req.params.id)

        if (result === "userNotFound") {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User permanently deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})



// 6. GET ALL USERS (GET) - /user
userController.get('/', async (req, res) => {
    try {
        const users = await userServices.ListUsersService()
        return res.status(200).json({
            message: "success",
            data: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})




// 7. GET SINGLE USER BY ID (GET) - /user/:id
userController.get('/:id', async (req, res) => {
    try {
        const user = await userServices.GetUserByIdService(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "success",
            data: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})





//-----------------------------------------------------------------------------------------------------



userController.put('/update/:userId', userServices.updateServices)
userController.delete('/delete/:userId', userServices.deleteServices)
userController.patch('/restore/:userId', userServices.restoreServices)



// list all users  

userController.get('/list', async (req, res) => {
    try {
        const data = await userServices.listUsersServices()
        return res.status(200).json({ message: "all users", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
})



userController.get('/findByPk/:userId', userServices.userByPk)



userController.get('/findByPk/:userId', userServices.UpdatePasswordServices)


export default userController