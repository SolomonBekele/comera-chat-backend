import Redis from "ioredis";


const redisClient = new Redis({
  host: process.env.REDIS_HOST ,
  port: process.env.REDIS_PORT ,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error", err));

export default redisClient;
