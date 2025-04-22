import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { sendResetEmail } from "../../utils/sendEmail.js";
import Users from "../../models/Users.js";
import PasswordReset from "../../models/PasswordReset.js";
import { client } from "../../index.js";
import Chats from "../../models/Chats.js";


export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const role = req.body.role || "USER"
    
    // Check if user exists
    const user = await Users.findOne({ username, role });

    if (!user) 
      return res.status(500).json({ message: "Incorrect Username", status: false });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) 
      return res.status(500).json({ message: "Incorrect Username or Password", status: false });

    // Generate Tokens
    const accessToken = jwt.sign({ userId: user._id, role: user.role, }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id, role: user.role, }, process.env.JWT_SECRET, { expiresIn: "7d" });

    if (!client.isOpen) {
      await client.connect();
    }
    
    // Store refresh token in Redis
    const response = await client.set(user._id.toString(), refreshToken, {
        EX: 7 * 24 * 60 * 60,
    })

    if (response !== "OK") {
      console.error("Error storing refresh token in Redis:", response);
      return res.status(500).json({ message: "Error storing refresh token" });
    }
    
    // Remove password field before sending user data
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.json({ status: true, message: "Login Successful", user: userWithoutPassword, accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, aadhaar_number, firstname, lastname, parent_email, age, phone } = req.body;
    const role = req.body?.role?.toUpperCase() || "USER";

    if (role === "ADMIN") {
      return res.status(400).json({ message: "You can't register with an admin role" });
    }
    
    const ageVerified = parseInt(age) >= 18;
    
    // Efficient single query to check existing user data
    const existingUser = await Users.findOne({
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
    const user = await Users.create({
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

// get all users exepct current user 
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ 
      _id: { $ne: req.params.id }, 
      is_active: true,
      role: "USER",
    }).select("email username avatarImage _id");  

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


// get all contact users 
export const getAllContactsUsers = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find all chats where the user is a participant
    const chats = await Chats.find({ participants: id, is_active: true  })
      .populate("participants", "username avatarImage email _id") // Get user details
      .lean(); // Convert Mongoose documents to plain objects for performance

    // Extract unique contacts from chats
    const contacts = [];
    const addedUserIds = new Set(); // To avoid duplicates

    chats.forEach((chat) => {
      chat.participants.forEach((participant) => {
        if (participant._id.toString() !== id && !addedUserIds.has(participant._id.toString())) {
          contacts.push({
            _id: participant._id,
            username: participant.username,
            avatarImage: participant.avatarImage,
            email: participant.email,
            lastMessage: chat.last_message
              ? {
                  text: chat.last_message.text || "",
                  sender: chat.last_message.sender_id.toString() === id ? "You" : "Them",
                  sentAt: chat.last_message.sent_at || null,
                }
              : null,
          });
          addedUserIds.add(participant._id.toString());
        }
      });
    });

    return res.json(contacts);
  } catch (ex) {
    console.error(ex);
    next(new Error("Internal server error while fetching contacts"));
  }
};


export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id; // Capturing the user ID from the URL
    const avatarImage = req.body.image; // Capturing the image URL from the body

    // Find the user by ID and update their avatar image and avatar status
    const userData = await Users.findByIdAndUpdate(
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

    const user = await Users.findOne({ email });
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

  const user = await Users.findById(resetRequest.userId);
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  // Update password
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  // Remove the used reset token from DB
  await PasswordReset.deleteOne({ _id: resetRequest._id });

  res.json({ status: true, message: "Password reset successful" });
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh Token Required" });
    }

    // Verify Refresh Token
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
      }

      if (!client.isOpen) {
        await client.connect();
      }

      try {
        const storedToken = await client.get(decoded.userId.toString())

        if (!storedToken || storedToken !== refreshToken) {
          return res.status(403).json({ message: "Token invalid or expired" });
        }

        // Generate a new Access Token
        const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role, }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Optionally, you can also return a new refresh token here if needed
        res.json({ accessToken: newAccessToken });

      } catch (err) {
        return res.status(500).json({ message: "Error accessing Redis" });
      }
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOnlineStatus = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ is_online: user.is_online });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export const logOut = async (req, res) => {
  try {
    const { userId } = req.body; // User ID from frontend

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Remove the user from onlineUsers (in-memory store) if necessary
    if (onlineUsers.has(userId)) {
      onlineUsers.delete(userId); // Ensuring the user is removed from the online session tracking
    }

    // Ensure Redis client is connected
    if (!client.isOpen) {
      await client.connect();
    }

    // Log the Redis key to check if it exists
    const tokenExists = await client.exists(userId);

    // If the token doesn't exist, log it but continue the process
    if (tokenExists === 0) {
      console.log(`No active session found for user ${userId}`);
      // You can choose to still log the user out, even though no session was found in Redis
    }

    // Remove the user's refresh token from Redis if it exists
    if (tokenExists === 1) {
      await client.del(userId); // Using await to ensure Redis command completes
      console.log(`Removed user ${userId}'s session from Redis`);
    }

    // Respond with a success message, regardless of whether the session was found
    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("Error during logout:", err); // Log the error for debugging
    res.status(500).json({ message: "Server error during logout" });
  }
};


