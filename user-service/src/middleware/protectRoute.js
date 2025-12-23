import jwt from "jsonwebtoken";
import redisClient from "../../../common/src/config/redisClient.js";


import i18n from "../i18n/langConfig.js";
import logger from "../utils/logger.js";
import { getUserByIdService } from "../services/userService.js";


const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || token === "null") {
      logger.warn("Unauthorized access attempt: No token provided");
      return res.status(401).json({ error: i18n.__("UNAUTHORIZED_NO_TOKEN") });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    // Get stored token from Redis
    const storedToken = await redisClient.get(decoded.userId);

    if (!storedToken || storedToken !== token) {
      logger.error("Invalid or expired token")
      return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
  // additional
    const user = await getUserByIdService(decoded.userId);

    if (!user) {
      logger.warn(`Invalid token: user not found for ID ${decoded.userId}`);
      return res.status(404).json({ error: i18n.__("INVALID_TOKEN_OR_USER") });
    }


    // Set locale based on user language
    if (user.language === "am") i18n.setLocale("am");
    else if (user.language === "ar") i18n.setLocale("ar");
    else i18n.setLocale("en");

    req.user = user;
    logger.info(`Route access granted for user ${user.id}, role ${user.role}`);
    next();

  } catch (error) {
    logger.error(`Error in protectRoute middleware: ${error.message}\n${error.stack}`);
    res.status(400).json({ success: false, message: i18n.__("INTERNAL_SERVER_ERROR")});
  }
};

export default protectRoute;