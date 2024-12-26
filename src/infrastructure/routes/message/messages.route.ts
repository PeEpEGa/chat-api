import express, { Router } from "express";
import dotenv from "dotenv";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { setMessagesRouteDependencies } from "./messages-route-setup";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { createClientLimiter } from "../../middlewares/client-limiter";

const router: Router = express.Router();
const { messagesController, tokenService } = setMessagesRouteDependencies();
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;

const limiter = createClientLimiter(5, secretKey);

router.post(
  "/",
  limiter,
  authenticate(tokenService),
  adaptRoute(messagesController.createMessage.bind(messagesController))
);
router.delete(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(messagesController.deleteMessage.bind(messagesController))
);
router.get(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(messagesController.getMessageById.bind(messagesController))
);
router.get(
  "/chat/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(messagesController.getAllMessagesByChat.bind(messagesController))
);
router.get(
  "/chat/:id/paginated",
  limiter,
  authenticate(tokenService),
  adaptRoute(
    messagesController.getAllMessagesByChatPaginated.bind(messagesController)
  )
);

export default router;
