import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetEmail } from "../config/email.js";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
      
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
      
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, aadhaar_number, firstname, lastname, parent_email, age, phone } = req.body;
    
    const ageVerified = parseInt(age) >= 18;
    
    // Efficient single query to check existing user data
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existingUser) {
      let msg = "User already exists";
      if (existingUser.username === username) msg = "Username already used";
      else if (existingUser.email === email) msg = "Email already used";
      else if (existingUser.phone === phone) msg = "Phone number already used";

      return res.status(409).json({ msg, status: false });
    }

    // Hash password securely
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({ msg: "Error hashing password", status: false });
    }

    // Create new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      aadhaar_number,
      firstname,
      lastname,
      parent_email,
      age: parseInt(age),
      phone,
      imageUrl: "",
      age_verified: ageVerified,
    });

    // Convert to object and remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ status: true, user: userResponse });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id; // Capturing the user ID from the URL
    const avatarImage = req.body.image; // Capturing the image URL from the body

    // Find the user by ID and update their avatar image and avatar status
    const userData = await User.findByIdAndUpdate(
      userId, // Using the userId from the URL parameter
      {
        isAvatarImageSet: true, // Flagging the avatar image as set
        avatarImage, // Updating the avatarImage field with the provided image URL
      },
      { new: true } // Return the updated user document
    );

    return res.json({
      isSet: userData.isAvatarImageSet, // Returning if the avatar image was successfully set
      image: userData.avatarImage, // Returning the new avatar image URL
    });
  } catch (ex) {
    next(ex); // Passing any errors to the next middleware (usually an error handler)
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000; // Token expires in 1 hour

    // Store token in database (Ensure PasswordReset model exists)
    await PasswordReset.create({ userId: user._id, token, expiresAt });

    // Send reset email
    await sendResetEmail(user.email, token);

    res.json({ status: true, message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetRequest = await PasswordReset.findOne({ token });

  if (!resetRequest || resetRequest.expiresAt < Date.now()) {
    return res.status(400).json({ status: false, message: "Invalid or expired token" });
  }

  const user = await User.findById(resetRequest.userId);
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  // Update password
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  // Remove the used reset token from DB
  await PasswordReset.deleteOne({ _id: resetRequest._id });

  res.json({ status: true, message: "Password reset successful" });
}

export const logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
