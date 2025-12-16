import 'dotenv/config';
import logger from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import i18n from './i18n/langConfig.js';
import { authenticateRequest } from './middleware/authMiddleware.js';
import connectToMongoDB from './repositories/mongo/config/configMongoDb.js';




const app = express();
const PORT = process.env.PORT ;


//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});






app.use("/api/chat/message",authenticateRequest, messageRoutes);
app.use("/api/chat/conversation",authenticateRequest,conversationRoutes);


//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  connectToMongoDB()
  logger.info(`Chat service running on port ${PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});