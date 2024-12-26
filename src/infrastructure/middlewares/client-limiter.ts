import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import jwt from "jsonwebtoken";
import { redisClient } from "../../redis-client";

export const createClientLimiter = (limit: number, secret: string) => {
  return rateLimit({
    windowMs: 60 * 1000,
    max: limit,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => {
        if (!redisClient.isOpen) {
          await redisClient.connect(); // Ensure Redis client is connected
        }
        console.log("Redis Command:", args);
        return redisClient.sendCommand(args);
      },
    }),
    keyGenerator: (req) => {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, secret) as { userId: string };
          console.log("Key Generated for User ID:", decoded.userId);
          return decoded.userId;
        } catch (error) {
          if (error instanceof Error) {
            console.error("JWT Verification Failed:", error.message);
          } else {
            console.error("JWT Verification Failed:", error);
          }
          return "invalid_token";
        }
      }

      console.log("No Authorization Header Found");
      return "no_token";
    },
    message: "429 Too Many Requests: Per-user limit exceeded.",
  });
};
