// socket.js
import { Server } from 'socket.io';

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

    socket.on("add-user", (userId) => {
      global.onlineUsers.set(userId, socket.id);
    //   console.log(`User ${userId} added with socket id ${socket.id}`);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = global.onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        // console.log(`Message sent to user ${data.to}`);
      }
    });

    socket.on('disconnect', () => {
      // Handle socket disconnection
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io; // If you need to use the io instance elsewhere
};
