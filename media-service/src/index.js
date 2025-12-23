import 'dotenv/config';
import logger from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mediaRoutes from "./routes/mediaRoutes.js"
import errorHandler from "./middleware/errorHandler.js";
import i18n from './i18n/langConfig.js';
import protectRoute from '../../user-service/src/middleware/protectRoute.js';


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


//Routes
app.use("/api/media", protectRoute,mediaRoutes);



//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Media service running on port ${PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});