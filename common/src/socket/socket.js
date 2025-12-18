import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-adapter";
import "dotenv/config"
import { pubClient, subClient } from "../config/socketRedis.js";
import {
  setUserSocket,
  removeUserSocket,
  getUserSocket,
  getOnlineUsers,
} from "./socketStore.js";
import { socketAuthMiddleware } from "./socketAuth.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// 🔥 Redis adapter
io.adapter(createAdapter(pubClient, subClient));

// 🔐 JWT auth middleware
io.use(socketAuthMiddleware);

/**
 * Exported helper
 */
export const getReceiverSocketId = async (receiverId) => {
  return await getUserSocket(receiverId);
};

io.on("connection", async (socket) => {
  
  const userId = socket.user.id;

  console.log("🔌 User connected:",userId,  socket.id);

  // 🔁 Handle reconnect (overwrite old socket)
  
  await setUserSocket(userId, socket.id);

  // 🔔 Notify online users
  io.emit("getOnlineUsers", await getOnlineUsers());

  // ⌨️ Typing indicator
  socket.on("typing:start", async ({ receiverId, conversationId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing:start", {
        from: userId,
        conversationId,
      });
    }
  });

  socket.on("typing:stop", async ({ receiverId, conversationId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing:stop", {
        from: userId,
        conversationId,
      });
    }
  });

  // 👁️ Seen indicator
  socket.on("message:seen", async ({ messageId, receiverId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("message:seen", {
        messageId,
        seenBy: userId,
      });
    }
  });

  socket.on("disconnect", async () => {
    console.log("❌ User disconnected:", userId, socket.id);

    await removeUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", await getOnlineUsers());
  });
});

export { app, io, server };
