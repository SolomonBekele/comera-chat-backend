import redisClient from "../config/redisClient.js";

const ONLINE_USERS_KEY = "online_users";

/**
 * userId -> socketId
 */
export const setUserSocket = async (userId, socketId) => {
  await redisClient.hset(ONLINE_USERS_KEY, userId, socketId);
};

export const removeUserSocket = async (userId) => {
  const existingSocket = await redisClient.hget(ONLINE_USERS_KEY, userId);

  // 🔐 only remove if same socket
  if (existingSocket === socketId) {
    await redisClient.hdel(ONLINE_USERS_KEY, userId);
  }
}


export const getUserSocket = async (userId) => {
  return await redisClient.hget(ONLINE_USERS_KEY, userId);
};

export const getOnlineUsers = async () => {
  return await redisClient.hkeys(ONLINE_USERS_KEY);
};
