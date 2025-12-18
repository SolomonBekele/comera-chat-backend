import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../../../common/src/config/redisClient.js"

/**
 * Two-layer gateway limiter:
 *  - short-window global limiter (burst protection)
 *  - per-service weighted limiter (sustained & heavy-endpoint protection)
 */

// Global short-window limiter: prevents bursts (e.g., 200 req/s total per IP)
export const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "gw_global",
  points: 200,     // burst capacity
  duration: 1,     // per second
  blockDuration: 5 // block 5 seconds if exceeded
});

// Per-service/minute weighted limiter
export const serviceLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "gw_service",
  points: 1000,
  duration: 60, // per minute
  blockDuration: 60 // block 1 minute
});

// Middleware that first checks global limiter then weighted limiter
export const gatewayRateMiddleware = (options = {}) => {
  // options.weightResolver = (req) => weight
  const weightResolver = options.weightResolver || ((req) => 1);

  return async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const weight = Math.max(1, Number(weightResolver(req) || 1));

    try {
      // fast fail on short window
      await globalLimiter.consume(ip, weight);
    } catch (rej) {
      res.setHeader("Retry-After", Math.ceil(rej.msBeforeNext / 1000));
      return res.status(429).json({ success: false, message: "Too many requests (gateway - burst)" });
    }

    try {
      // controlled sustained limiter per service
      const serviceName = req.serviceName || "unknown";
      const key = `${serviceName}:${ip}`;
      const rlRes = await serviceLimiter.consume(key, weight);

      // expose headers
      res.setHeader("RateLimit-Limit", 1000);
      res.setHeader("RateLimit-Remaining", rlRes.remainingPoints);
      res.setHeader("RateLimit-Reset", Math.ceil(rlRes.msBeforeNext / 1000));

      return next();
    } catch (rej) {
      res.setHeader("Retry-After", Math.ceil(rej.msBeforeNext / 1000));
      return res.status(429).json({ success: false, message: "Too many requests (gateway - service)" });
    }
  };
};
