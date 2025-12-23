import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-adapter";
import "dotenv/config"
import { pubClient, subClient } from "./socketRedis.js";
import { socketAuthMiddleware } from "../Middlewares/socketAuth.js";
import { registerSocketHandlers } from "../socketHandler.js";
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

 io.on("connection", (socket) => registerSocketHandlers(io, socket));

export { app, io, server };
