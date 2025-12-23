import Redis from "ioredis";

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

export const pubClient = new Redis(redisOptions);
export const subClient = pubClient.duplicate();

pubClient.on("connect", () => console.log("✅ Redis pub connected"));
subClient.on("connect", () => console.log("✅ Redis sub connected"));

pubClient.on("error", (err) => console.error("❌ Redis pub error", err));
subClient.on("error", (err) => console.error("❌ Redis sub error", err));
