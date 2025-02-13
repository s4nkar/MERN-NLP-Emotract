// /config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connection Successful");
  } catch (err) {
    console.error("DB Connection Unsuccessful", err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;
