// /config/db.js
import mongoose from "mongoose";
import { createDefaultAdmin } from "./admin.js";

const connectDB = async () => {
  try {
    // Use host.docker.internal to connect to the MongoDB running on the host
    await mongoose.connect(process.env.MONGO_URL || "mongodb://host.docker.internal:27017/chat");
    await createDefaultAdmin();
    console.log("DB Connection Successful");
  } catch (err) {
    console.error("DB Connection Unsuccessful", err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;
