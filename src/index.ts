import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECTION as string)
  .then(() => {
    console.log("[database]: Connected to the database");
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(`[database]: ${error}`);
  });
