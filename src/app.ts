import express, { Express } from "express";
import messageRouter from "./infrastructure/routes/message/messages.route";
import userRouter from "./infrastructure/routes/user/user.route";
import authRouter from "./infrastructure/routes/auth/auth.route";
import chatRouter from "./infrastructure/routes/chat/chats-route";

const app: Express = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/auth", authRouter);
app.use("/chats", chatRouter);

export default app;
