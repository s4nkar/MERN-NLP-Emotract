import { 
    addMessage, 
    getMessages 
} from "../controllers/messageController.js";
import express from "express";

const messageRoutes = express.Router();

/**
 * @swagger
 * /api/messages/addmsg:
 *   post:
 *     summary: Add a new message between two users
 *     description: Create a new message between two users and store it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *                 description: The user sending the message
 *                 example: "user123"
 *               to:
 *                 type: string
 *                 description: The user receiving the message
 *                 example: "user456"
 *               message:
 *                 type: string
 *                 description: The message content
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Message added successfully."
 *       400:
 *         description: Bad Request - missing fields (from, to, message)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "All fields (from, to, message) are required."
 *       500:
 *         description: Server error - failed to add the message to the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Failed to add message to the database"
 */
messageRoutes.post("/addmsg/", addMessage);

/**
 * @swagger
 * /api/messages/getmsg:
 *   post:
 *     summary: Get all messages between two users
 *     description: Retrieve all messages between two users, ordered by the most recent ones.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *                 description: The user requesting the messages (sender)
 *                 example: "user123"
 *               to:
 *                 type: string
 *                 description: The other user involved in the conversation (receiver)
 *                 example: "user456"
 *     responses:
 *       200:
 *         description: List of messages between the specified users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fromSelf:
 *                     type: boolean
 *                     description: True if the message was sent by the requesting user
 *                     example: true
 *                   message:
 *                     type: string
 *                     description: The message content
 *                     example: "Hello, how are you?"
 *       400:
 *         description: Bad Request - missing 'from' or 'to' parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Both 'from' and 'to' users are required"
 *       500:
 *         description: Server error - failed to retrieve messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 */
messageRoutes.post("/getmsg/", getMessages);

export default messageRoutes;
