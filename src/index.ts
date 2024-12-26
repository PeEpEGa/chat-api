import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import { connectRedis } from "./redis-client";

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();

    // Connect to MongoDB
    await mongoose.connect(process.env.DB_CONNECTION as string);
    console.log("[database]: Connected to the database");

    // Start the server
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[server]: Failed to start server", error);
  }
};

startServer();
