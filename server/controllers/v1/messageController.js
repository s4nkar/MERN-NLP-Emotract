import Messages from "../../models/Messages.js"
import analyzeMessage from "../../utils/analyze.js";

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Ensure both 'from' and 'to' are provided
    if (!from || !to) {
      return res.status(400).json({ msg: "Both 'from' and 'to' users are required" });
    }

    // Query for messages between 'from' and 'to' users, ordered by 'updatedAt'
    const messages = await Messages.find({
      users: { $all: [from, to] },
    })
      .sort({ updatedAt: 1 })
      .select("message sender updatedAt");

    // Efficiently map over messages to construct the desired response
    const projectedMessages = messages.map(({ message, sender }) => ({
      fromSelf: sender.toString() === from, // Check if the sender is the 'from' user
      message: message.text,
    }));

    return res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    // Input validation
    const { from, to, message } = req.body;
    if (!from || !to || !message) {
      return res.status(400).json({ msg: "All fields (from, to, message) are required." });
    }

    // get emotions from fast api 
    const [bertEmotion, RobertaEmotion, lrEmotion, rfEmotion ] = await analyzeMessage(message);

    // Create new message in the database
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.status(201).json({ msg: "Message added successfully." });
    } else {
      return res.status(500).json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    // Pass detailed error to the next middleware for logging
    console.error(ex); // You can log it for debugging
    next(new Error("Internal server error while adding message"));
  }
};

