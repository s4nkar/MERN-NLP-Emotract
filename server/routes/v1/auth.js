import { 
  login, 
  register, 
  getAllUsers, 
  setAvatar, 
  logOut, 
  forgotPassword,
  resetPassword,
  refreshToken,
  getUserOnlineStatus,
} from "../../controllers/v1/userController.js";
import express from "express";

const v1AuthRoutes = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to your account
 *     description: Login using username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: user123
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: secretpassword
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: User details
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: user123
 *                     name:
 *                       type: string
 *                       example: John Doe
 *       400:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Incorrect Username or Password
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user
 *                 example: johnDoe
 *               email:
 *                 type: string
 *                 description: Email address for the new user
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *                 example: secretpassword
 *     responses:
 *       200:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: 'johnDoe'
 *                     email:
 *                       type: string
 *                       example: 'john@example.com'
 *       400:
 *         description: Username or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Username already used'
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Internal server error'
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/register", register);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     description: Get all users except the one specified by the ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user making the request (will be excluded from the returned list)
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of users excluding the requesting user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "605c72ef153207001f6470d1"
 *                   username:
 *                     type: string
 *                     example: "johnDoe"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   avatarImage:
 *                     type: string
 *                     example: "http://someurl.com/avatar.jpg"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Internal server error'
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.get("/allusers/:id", getAllUsers);

/**
 * @swagger
 * /api/auth/setavatar/{id}:
 *   post:
 *     summary: Set the avatar image for a user
 *     description: Allows a user to set their avatar image using the provided image URL.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user whose avatar is being updated.
 *         required: true
 *         type: string
 *         example: "605c72ef153207001f6470d1"
 *       - name: image
 *         in: body
 *         description: The URL of the avatar image.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             image:
 *               type: string
 *               description: The URL to the avatar image.
 *               example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSet:
 *                   type: boolean
 *                   example: true
 *                 image:
 *                   type: string
 *                   example: "https://example.com/avatar.jpg"
 *       400:
 *         description: Invalid image URL or user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid image URL"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/setavatar/:id", setAvatar);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset email with a token if the user exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting a password reset.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Password reset email sent"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid email format or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid email"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset the user's password
 *     description: Allows a user to reset their password using a valid reset token.
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Password reset token received via email.
 *         required: true
 *         schema:
 *           type: string
 *         example: "abcd1234efgh5678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password to set.
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Password reset successfully"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid token or missing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid or expired token"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the user's access token using the refresh token.
 *     description: Allows the user to refresh their access token by providing a valid refresh token. The refresh token must be valid and exist in Redis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided by the user.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDYwYjQxZGI2NmQ3OTg5MTg2YjFiNmY0MTFhNDcxZDYyIiwiaWF0IjoxNjYyMDA5ODIyfQ.5MnMY7tOFiUJ1MlqzV8eZ7MmRLoRxwzDWmxtQGqXfr9dG0Fj9gxldRjJfOoqj9qgfrGF04wqdk9bq6In0A8w"
 *     responses:
 *       200:
 *         description: Successfully refreshed access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDYwYjQxZGI2NmQ3OTg5MTg2YjFiNmY0MTFhNDcxZDYyIiwiaWF0IjoxNjYyMDA5ODIyfQ.5MnMY7tOFiUJ1MlqzV8eZ7MmRLoRxwzDWmxtQGqXfr9dG0Fj9gxldRjJfOoqj9qgfrGF04wqdk9bq6In0A8w"
 *       400:
 *         description: Refresh token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh Token Required"
 *       403:
 *         description: Invalid or expired refresh token, or token does not exist in Redis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Refresh Token"
 *       500:
 *         description: Server error or issue accessing Redis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error accessing Redis"
 */
v1AuthRoutes.post("/refresh-token", refreshToken);

v1AuthRoutes.get("/online-status/:id", getUserOnlineStatus);

/**
 * @swagger
 * /api/auth/logout/{id}:
 *   get:
 *     summary: Log out the user
 *     description: Logs out a user by removing them from the online users list using their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user who is logging out.
 *         required: true
 *         type: string
 *         example: "605c72ef153207001f6470d1"
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User id is required"
 *       404:
 *         description: User not found in the online users list
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: boolean
 *                   example: false
 */
v1AuthRoutes.post("/logout", logOut);

export default v1AuthRoutes;
