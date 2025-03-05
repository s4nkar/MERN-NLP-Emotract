// socket.js
import { Server } from 'socket.io';
import User from '../models/User.js';

export const setupSocket = (server) => {
  // Use default WebSocket engine (ws) that comes with socket.io
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",  // React app on port 5173
      credentials: true,  // Allow credentials to be passed
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;
    // console.log('A user connected:', socket.id);

    socket.on("add-user", async (userId) => {
      global.onlineUsers.set(userId, socket.id);

      try {
        await User.findByIdAndUpdate(userId, { is_online: true });
        // console.error("ISONLINE TRUE");
      } catch (err) {
        console.error("Error updating user online status:", err);
      }
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = global.onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        // console.log(`Message sent to user ${data.to}`);
      }
    });

     // Handle user logout
     socket.on("logout", async (userId) => {
      console.log("SERVER LOGOUT");
      try {
        await User.findByIdAndUpdate(userId, { is_online: false });
        console.log(`User ${userId} has logged out`);
      } catch (err) {
        console.error("Error updating user logout status:", err);
      }
    });

    socket.on('disconnect', async () => {
      try {
          const user = await User.findOneAndUpdate(
            { socket_id: socket.id },
            { is_online: false },
            { new: true }
          );
          if (user) {
            console.log(`User ${user._id} is now offline`);
          }
        } catch (err) {
          console.error("Error updating user offline status:", err);
        }
    });
  });

  return io; // If you need to use the io instance elsewhere
};
