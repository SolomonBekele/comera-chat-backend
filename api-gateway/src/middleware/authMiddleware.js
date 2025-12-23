import logger from "../utils/logger.js";
import axios from "axios";

export const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.warn("Access attempt without valid token!");
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    // Verify token by making a request to your API
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/user/profile/self/token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if(!response?.data?.user || response?.data?.response) throw new Error("Authentication required")
    req.user = response.data.user;
    next();
  } catch (error) {
  
    // Check if Axios response exists
    if (error.response) {
      logger.error(
        "Token validation failed!",
        `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
      );
      return res.status(error.response.status).json({
        message: error.response.data.message || "Invalid or expired token",
        success: false,
      });
    } else {
      // Other errors (network, etc.)
      logger.error("Token validation error:", error.message);
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }
};
