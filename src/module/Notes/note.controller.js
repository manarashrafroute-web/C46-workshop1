// note.controller.js
import { Router } from "express";
import * as noteServices from "./Services/note.service.js";

const noteController = Router();

// 1. CREATE NOTE (POST) - /note/create
noteController.post('/create', async (req, res) => {
    try {
        const data = await noteServices.CreateNoteService(req.body)

        return res.status(201).json({
            message: "Note created successfully",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

// 2. GET ALL NOTES (GET) - /note
noteController.get('/', async (req, res) => {
    try {
        const notes = await noteServices.GetAllNotesService()
        return res.status(200).json({
            message: "success",
            data: notes
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

// 3. GET NOTES BY USER ID (GET) - /note/user/:userId
noteController.get('/user/:userId', async (req, res) => {
    try {
        const notes = await noteServices.GetNotesByUserIdService(req.params.userId)
        return res.status(200).json({
            message: "success",
            data: notes
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

// 4. GET SINGLE NOTE BY ID (GET) - /note/:id
noteController.get('/:id', async (req, res) => {
    try {
        const note = await noteServices.GetNoteByIdService(req.params.id)

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        return res.status(200).json({
            message: "success",
            data: note
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

// 5. UPDATE NOTE (PUT) - /note/:id
noteController.put('/:id', async (req, res) => {
    try {
        const noteId = req.params.id
        const { userId, ...updateData } = req.body

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                message: "userId is required"
            })
        }
        const result = await noteServices.UpdateNoteService(noteId, userId, updateData)

        //    const result = await noteServices.UpdateNoteService(req.params.id, req.body)

        if (result === "noteNotFound") {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        if (result === "notAuthorized") {
            return res.status(403).json({
                message: "You are not authorized to restore this note"
            })
        }

        return res.status(200).json({
            message: "Note updated successfully",
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

// 6. SOFT DELETE NOTE (DELETE) - /note/:id
noteController.delete('/:id', async (req, res) => {
    try {
        const noteId = req.params.id
        const { userId } = req.body

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                message: "userId is required"
            })
        }

        const result = await noteServices.DeleteNoteService(noteId, userId)

        if (result === "noteNotFound") {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        if (result === "notAuthorized") {
            return res.status(403).json({
                message: "You are not authorized to delete this note"
            })
        }

        return res.status(200).json({
            message: "Note deleted successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

// 7. RESTORE DELETED NOTE (PATCH) - /note/restore/:id
noteController.patch('/restore/:id', async (req, res) => {
    try {
        const result = await noteServices.RestoreNoteService(req.params.id)

        if (result === "noteNotFound") {
            return res.status(404).json({
                message: "Note not found or not deleted"
            })
        }

        return res.status(200).json({
            message: "Note restored successfully",
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

// 8. PERMANENTLY DELETE NOTE (DELETE) - /note/hard/:id
noteController.delete('/hard/:id', async (req, res) => {
    try {
        const result = await noteServices.HardDeleteNoteService(req.params.id)

        if (result === "noteNotFound") {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        return res.status(200).json({
            message: "Note permanently deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

export default noteController;