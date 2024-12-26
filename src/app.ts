import express, { Express } from "express";
import messageRouter from "./infrastructure/routes/message/messages.route";
import userRouter from "./infrastructure/routes/user/user.route";
import authRouter from "./infrastructure/routes/auth/auth.route";
import chatRouter from "./infrastructure/routes/chat/chats-route";
import cors from "cors";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "";
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/auth", authRouter);
app.use("/chats", chatRouter);

export default app;
