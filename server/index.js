import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import { Server } from "socket.io";
import logger  from "./middleware/logger.js";
import swaggerDocs from './config/swagger.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Logger middleware
app.use(logger);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
 
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Swagger Docs Route
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);

// Use default WebSocket engine (ws) that comes with socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",  // React app on port 5173
    credentials: true,  // Allow credentials to be passed
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
