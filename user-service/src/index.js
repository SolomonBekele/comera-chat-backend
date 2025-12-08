import dotenv from "dotenv";
import logger from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import i18n from './i18n/langConfig.js';
import { sensitiveEndpointsLimiter } from "./middleware/routeRateLimmiter.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT ;


//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});



//apply this sensitiveEndpointsLimiter to our routes
app.use("/api/auth/register", sensitiveEndpointsLimiter);

//Routes
app.use("/api/auth", routes);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});