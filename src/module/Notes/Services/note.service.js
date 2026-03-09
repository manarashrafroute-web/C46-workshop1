// note.service.js
import { Op } from "sequelize";
import Note from "../../../DB/models/note.model.js";
import User from "../../../DB/models/user.model.js";

// 1. CREATE NOTE SERVICE
export let CreateNoteService = async (data) => {
    // Check if user exists before creating note
    const user = await User.findByPk(data.userId)

    if (!user) {
        throw new Error("User not found")  // This will be caught by catch block
    }

    // Create the note
    const note = await Note.create(data)
    return note
}

// 2. GET ALL NOTES SERVICE
export let GetAllNotesService = async () => {
    // Get all notes with user information
    const notes = await Note.findAll({
        include: [
            {
                model: User,
                as: 'user',  // This should match the association name
                attributes: ['id', 'name', 'email']  // Only get these fields from user
            }
        ],
        order: [['createdAt', 'DESC']]  // Newest first
    })

    return notes
}

// 3. GET NOTES BY USER ID SERVICE
export let GetNotesByUserIdService = async (userId) => {
    // Check if user exists
    const user = await User.findByPk(userId)

    if (!user) {
        return []  // Return empty array if user doesn't exist
    }

    // Get all notes for a specific user
    const notes = await Note.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: [['createdAt', 'DESC']]
    })

    return notes
}

// 4. GET SINGLE NOTE BY ID SERVICE
export let GetNoteByIdService = async (noteId) => {
    // Find note by ID with user information
    const note = await Note.findOne({
        where: { id: noteId },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ]
    })

    return note
}

// 5. UPDATE NOTE SERVICE
export let UpdateNoteService = async (noteId, requestingUserId, updateData) => {
    // First, find the note
    const note = await Note.findByPk(noteId)

    // Check if note exists
    if (!note) {
        return "noteNotFound"
    }


    // VERIFY OWNERSHIP: Check if the requesting user is the owner
    if (note.userId !== parseInt(requestingUserId)) {
        return "notAuthorized"
    }



    // // If updating userId, check if new user exists
    // if (updateData.userId) {
    //     const user = await User.findByPk(updateData.userId)
    //     if (!user) {
    //         throw new Error("New user not found")
    //     }
    // }

    // Update the note
    await note.update(updateData)

    // Get updated note with user info
    const updatedNote = await GetNoteByIdService(noteId)

    return updatedNote
}

// 6. SOFT DELETE NOTE SERVICE
export let DeleteNoteService = async (noteId , requestingUserId) => {
    // Find the note
    const note = await Note.findByPk(noteId)

    // Check if note exists
    if (!note) {
        return "noteNotFound"
    }

    // VERIFY OWNERSHIP: Check if the requesting user is the owner
    if (note.userId !== parseInt(requestingUserId)) {
        return "notAuthorized"
    }

    // Soft delete the note
    await note.destroy()

    return "success"
}

// 7. RESTORE DELETED NOTE SERVICE
export let RestoreNoteService = async (noteId) => {
    // Find the note including soft-deleted ones
    const note = await Note.findOne({
        where: { id: noteId },
        paranoid: false  // This includes soft-deleted records
    })

    // Check if note exists
    if (!note) {
        return "noteNotFound"
    }

    // Check if note is already restored (not deleted)
    if (note.deletedAt === null) {
        return "noteNotFound"  // Note is not deleted
    }

    // Restore the note
    await note.restore()

    // Get restored note with user info
    const restoredNote = await GetNoteByIdService(noteId)

    return restoredNote
}

// 8. HARD DELETE NOTE SERVICE (Permanent)
export let HardDeleteNoteService = async (noteId) => {
    // Find the note including soft-deleted ones
    const note = await Note.findOne({
        where: { id: noteId },
        paranoid: false  // This includes soft-deleted records
    })

    // Check if note exists
    if (!note) {
        return "noteNotFound"
    }

    // Permanently delete the note
    await note.destroy({ force: true })

    return "success"
}

// 9. GET ALL NOTES (INCLUDING DELETED) - For admin purposes
export let GetAllNotesIncludingDeletedService = async () => {
    const notes = await Note.findAll({
        paranoid: false,  // Include soft-deleted records
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: [['createdAt', 'DESC']]
    })

    return notes
}

// 10. DELETE ALL NOTES BY USER ID (Soft delete)
export let DeleteAllUserNotesService = async (userId) => {
    // Check if user exists
    const user = await User.findByPk(userId)

    if (!user) {
        throw new Error("User not found")
    }

    // Soft delete all notes of the user
    const result = await Note.destroy({
        where: { userId: userId }
    })

    return {
        message: `${result} notes deleted successfully`
    }
}