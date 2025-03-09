import Chats from "../../models/Chats.js";
import Messages from "../../models/Messages.js"

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Ensure both 'from' and 'to' are provided
    if (!from || !to) {
      return res.status(400).json({ msg: "Both 'from' and 'to' users are required" });
    }

    // Find chat between users
    const chat = await Chats.findOne({ participants: { $all: [from, to] } });
    if (!chat) {
      return res.status(404).json({ msg: "No chat found between the users" });
    }

    // Query messages for the chat
    const messages = await Messages.find({ chat_id: chat._id })
      .sort({ updatedAt: 1 })
      .select("text sender_id updatedAt")
      .lean(); // Use lean() for better performance

    // Construct response
    const projectedMessages = messages.map(({ text, sender_id }) => ({
      fromSelf: sender_id.toString() === from, // Compare with logged-in user
      message: text,
    }));

    return res.status(200).json(projectedMessages);
  } catch (ex) {
    console.error(ex); // Log error for debugging
    next(new Error("Internal server error while fetching messages"));
  }
};

export const addMessage = async (req, res, next) => {
  try {
    // Input validation
    const { from, to, message, is_group } = req.body;
    if (!from || !to || !message) {
      return res.status(400).json({ msg: "All fields (from, to, message) are required." });
    }

    // Check if a chat already exists between the participants
    let chats = await Chats.find({
      participants: { $all: [from, to] },
    });

    let chat; // Variable to store the chat reference

    // If no existing chat, create a new one
    if (chats.length === 0) {
      chat = await Chats.create({
        participants: [from, to],
        is_group: is_group || false,
        last_message: {
          text: message,
          sender_id: from,
        },
      });
    } else {
      chat = chats[0]; // Use the first chat found
    }

    // Create new message in the database
    const messageData = await Messages.create({
      chat_id: chat._id,
      sender_id: from,
      text: message,
      read_by: [from],
    });

    // Update last message in the chat
    await Chats.findByIdAndUpdate(chat._id, {
      last_message: {
        text: message,
        sender_id: from,
        sent_at: new Date(),
      },
    });

    return res.status(201).json({ msg: "Message added successfully." });
  } catch (ex) {
    console.error(ex); // Log error for debugging
    next(new Error("Internal server error while adding message"));
  }
};


