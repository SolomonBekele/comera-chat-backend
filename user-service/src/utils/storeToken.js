import redisClient from "../../../common/config/redisClient.js"; 

export const storeUserToken = async (userId, token) => {
  // Store token with key as userId
  // Optional: set expiry, e.g., 15 hour = 900 seconds
  await redisClient.set(userId, token, "EX", 900);
};

export const removeToken = async (req, res) => {
  const userId = req.user.userId; 

  await redisClient.del(userId); // remove stored token
  res.json({ success: true, message: "Logged out successfully" });
};
