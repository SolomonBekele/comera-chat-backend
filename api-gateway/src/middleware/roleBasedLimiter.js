// roleBasedLimiter.js
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../../../common/config/redisClient.js";

/**
 * Role based limiter: different quotas for roles: guest, user, admin
 * - guest: low quota
 * - user: normal quota
 * - admin: high quota (or unlimited)
 *
 * This middleware expects `req.user` to exist (populated by auth middleware)
 */

// create separate limiters per role (prefix avoids key collisions)
const guestLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "role_guest",
  points: 30,
  duration: 60
});

const userLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "role_user",
  points: 300,
  duration: 60
});

const adminLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "role_admin",
  points: 2000,
  duration: 60
});

// mapping role -> limiter
const roleMap = {
  guest: guestLimiter,
  user: userLimiter,
  admin: adminLimiter
};

export const roleBasedLimiter = () => {
  return async (req, res, next) => {
    const role = (req.user && req.user.role) ? req.user.role : "guest";
    const id = (req.user && req.user.id) ? String(req.user.id) : req.ip;

    // admins can be allowed unlimited by skipping enforcement:
    if (role === "admin") {
      // optionally still allow extremely high limit or skip
      return next();
    }

    const limiter = roleMap[role] || roleMap.guest;

    try {
      const rlRes = await limiter.consume(id, 1);
      res.setHeader("X-Role", role);
      res.setHeader("RateLimit-Remaining", rlRes.remainingPoints);
      next();
    } catch (rej) {
      res.setHeader("Retry-After", Math.ceil(rej.msBeforeNext / 1000));
      return res.status(429).json({ success: false, message: "Too many requests (role quota)" });
    }
  };
};
