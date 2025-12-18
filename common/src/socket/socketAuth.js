import jwt from "jsonwebtoken";
import "dotenv/config"
import redisClient from "../config/redisClient.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication token missing"));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET );
    const storedToken = await redisClient.get(decoded.userId);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
    socket.user = {
      id: decoded.userId,
    };

    next();
  } catch (err) {
    console.log(err.message);
    next(new Error("Invalid or expired token",err));
  }
};
