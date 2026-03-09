import { Op, Sequelize } from "sequelize";
import User from "../../../DB/models/user.model.js";
import Note from "../../../DB/models/note.model.js";


// sign up
export let RegistrationService = async (data) => {

    // const { name, email, password, role } = req.body

    let isEmailExist = await User.findOne({
        where: { email: data.email }
    })

    if (isEmailExist) {
        return "userExists"
    }

    let user = await User.create(data)
    delete user.dataValues.password
    return user

}



// 2. Update user
export let UpdateUserService = async (userId, updateData) => {
    // Check if user exists
    const user = await User.findByPk(userId)
    if (!user) {
        return "userNotFound"
    }

    // If updating email, check if new email already exists for another user
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({
            where: {
                email: updateData.email,
                id: { [Op.ne]: userId }   // Not the same user
            }
        })

        if (existingUser) {
            return "emailExists"
        }
    }


    // Update user
    await user.update(updateData)

    // Return updated user without password
    const updatedUser = user.toJSON()
    delete updatedUser.password
    return updatedUser



}



// 3. SOFT DELETE USER SERVICE
export let DeleteUserService = async (userId) => {
    // Find the user
    const user = await User.findByPk(userId)

    // Check if user exists
    if (!user) {
        return "userNotFound"
    }

    // Soft delete the user (paranoid: true in model)
    await user.destroy()

    return "success"
}


// 4. RESTORE DELETED USER SERVICE
export let RestoreUserService = async (userId) => {
    // Find the user including soft-deleted ones
    const user = await User.findOne({
        where: { id: userId },
        paranoid: false  // This includes soft-deleted records
    })

    // Check if user exists
    if (!user) {
        return "userNotFound"
    }

    // Check if user is already restored (not deleted)
    if (user.deletedAt === null) {
        return "userNotFound"  // User is not deleted
    }

    // Restore the user
    await user.restore()

    // Remove password from response
    const restoredUser = user.toJSON()
    delete restoredUser.password

    return restoredUser
}



// 5. HARD DELETE USER SERVICE (Permanent)
export let HardDeleteUserService = async (userId) => {
    // Find the user including soft-deleted ones
    const user = await User.findOne({
        where: { id: userId },
        paranoid: false  // This includes soft-deleted records
    })

    // Check if user exists
    if (!user) {
        return "userNotFound"
    }

    // Permanently delete the user
    await user.destroy({ force: true })

    return "success"
}


// 6. LIST ALL USERS SERVICE
export let ListUsersService = async () => {
    // Find all users, exclude password, order by newest first
    const users = await User.findAll({
        attributes: { exclude: ['password'] },  // Don't send passwords
        order: [['createdAt', 'DESC']]          // Newest first
    })

    return users
}




// 7. GET USER BY ID SERVICE
export let GetUserByIdService = async (userId) => {
    // Find user by ID and include their notes
    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Note,
                as: 'notes',
                attributes: ['id', 'title', 'content', 'createdAt']
            }
        ]
    })

    return user
}
















































































//------------------------------------------------------------------------------

/**
 * update
 * save
 * increment
 * decrement
 */

// export const updateServices1 = async (req, res) => {
//     try {
//         const { first_name, last_name, email, password, age, gender } = req.body;
//         const { userId } = req.params;
//         const updatedData = {}

//         if (first_name) updatedData.first_name = first_name;
//         if (last_name) updatedData.last_name = last_name;
//         if (email) {
//             const isEmailExist = await User.findOne({ where: { email } }) // {} , null] 
//             if (isEmailExist) {
//                 return res.status(400).json({
//                     message: "User already exists"
//                 })
//             }

//             updatedData.email = email;

//         }
//         if (password) updatedData.password = password;
//         if (gender) updatedData.gender = gender;
//         if (age) updatedData.age = age;

//         const isUpdated = await User.update(
//             updatedData,
//             { where: { id: userId } }
//         )

//         if (!isUpdated[0]) {
//             return res.status(404).json({ message: "user not found " })
//         }

//         return res.status(201).json({ message: "user created successlly ", isUpdated })


//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Something went wrong",
//             error
//         })
//     }
// }


export const updateServices = async (req, res) => {
    try {


        const { userId } = req.params
        const { name, email, password, role } = req.body

        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ message: "user not foun" })
        }

        if (name) user.name = name
        if (email) {
            const isEmailExist = await User.findOne({ where: { email } })

            if (isEmailExist) {
                return res.status(400).json({ message: "user already exists" })
            }

            user.email = email
        }
        if (password) user.password = password
        if (role) user.role = role


        await user.save()

        return res.status(200).json({ message: "user updated suceesssflly" })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

/**
 * 
 * destroy
 * truncate
 */


export const deleteServices = async (req, res) => {
    try {

        const { userId } = req.params;

        const isDeleted = await User.destroy({ where: { id: userId } })

        if (!isDeleted) {
            return res.status(404).json({ message: "user not found " })
        }

        return res.status(200).json({ message: "user deleted successlly ", isDeleted })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}


export const restoreServices = async (req, res) => {
    try {

        const { userId } = req.params;

        const isRestored = await User.restore({ where: { id: userId } })

        if (!isRestored) {
            return res.status(404).json({ message: "user not found " })
        }

        return res.status(200).json({ message: "user retored successlly " })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const listUsersServices = async () => {
    const users = await User.findAll(
        {
            // //1- filtertion
            // where: {
            //     role : "user" ,

            //     [Op.or]: [
            //         { age: { [Op.between]: [20, 34] } },
            //         { gender: 'male' }
            //     ]
            // }

            //2- progection

            //attributes : {exclude : [password]} , 

            // 3- aggregation

            //  attributes :[  
            //     // [Sequelize.fn('MAX' , Sequelize.col('age')) , 'maxAge'],
            //     // [Sequelize.fn('MIN' , Sequelize.col('age')) , 'minAge'],
            //     // [Sequelize.fn('SUM' , Sequelize.col('age')) , 'countAge'],


            //     [Sequelize.fn('COUNT' , Sequelize.col('role')) , "countRole"]
            // ]

            // 4- sorting 

            //order : [["age" , 'ASC']]

            // 5- pagintion

            // limit : 2 ,
            // offset :2

            //6- group By

            group: 'role',

            attributes: ['role',
                [Sequelize.fn('COUNT', Sequelize.col('role')), 'role_count']
            ]

        }
    )

    return users
}






export const userByPk = async (req, res) => {
    try {

        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['role', 'password'] }

        })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "user", user })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}