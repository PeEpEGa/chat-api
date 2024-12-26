import { Router } from "express";
import dotenv from "dotenv";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { setChatRouteDependencies } from "./chats-route-setup";
import { createClientLimiter } from "../../middlewares/client-limiter";

const router: Router = Router();
const { chatController, tokenService } = setChatRouteDependencies();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "";

const limiter = createClientLimiter(5, JWT_SECRET);

router.post(
  "/",
  limiter,
  authenticate(tokenService),
  adaptRoute(chatController.createChat.bind(chatController))
);
router.get(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(chatController.getChatById.bind(chatController))
);
router.get(
  "/",
  limiter,
  authenticate(tokenService),
  adaptRoute(chatController.getChatsByUserId.bind(chatController))
);
router.delete(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(chatController.deleteChat.bind(chatController))
);

export default router;
