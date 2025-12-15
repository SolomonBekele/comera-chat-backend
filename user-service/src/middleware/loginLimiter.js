// loginLimiter.js
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../../../common/config/redisClient.js ";

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_attempt",
  points: 20,            // 20 attempts
  duration: 300,        // per 5 minutes
  blockDuration: 900    // block 15 minutes on exceed
});

export const loginLimiterMW = async (req, res, next) => {
  const key = req.ip || req.connection.remoteAddress;
  try {
    await loginLimiter.consume(key);
    return next();
  } catch (rej) {
    res.setHeader("Retry-After", Math.ceil(rej.msBeforeNext / 1000));
    return res.status(429).json({ success: false, message: "Too many login attempts. Try again later." });
  }
};

// helpers for login flow (penalty/reward)
export const penalizeLogin = async (ip, points = 1) => {
  try { await loginLimiter.consume(ip, points); } catch (e) { /* ignore */ }
};
export const resetLogin = async (ip) => {
  try { await loginLimiter.delete(ip); } catch (e) { /* ignore */ }
};
