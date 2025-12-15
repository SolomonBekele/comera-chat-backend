import mongoose from "mongoose";
import logger from "../../../utils/logger.js"
import i18n from "../../../i18n/langConfig.js";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    logger.info(i18n.__("MONGO_CONNECTED"));
    
  } catch (error) {
    logger.error(`${i18n.__("MONGO_FAILED")}: ${error.message}`);
  }
};

export default connectToMongoDB;
