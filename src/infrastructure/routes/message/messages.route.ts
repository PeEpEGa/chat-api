import express, { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { setMessagesRouteDependencies } from "./messages-route-setup";
import { authenticate } from "../../middlewares/authenticate.middleware";

const router: Router = express.Router();
const { messagesController, tokenService } = setMessagesRouteDependencies();

router.post(
  "/",
  authenticate(tokenService),
  adaptRoute(messagesController.createMessage.bind(messagesController))
);
router.delete(
  "/:id",
  authenticate(tokenService),
  adaptRoute(messagesController.deleteMessage.bind(messagesController))
);
router.get(
  "/:id",
  authenticate(tokenService),
  adaptRoute(messagesController.getMessageById.bind(messagesController))
);
router.get(
  "/chat/:id",
  authenticate(tokenService),
  adaptRoute(messagesController.getAllMessagesByChat.bind(messagesController))
);
router.get(
  "/chat/:id/paginated",
  authenticate(tokenService),
  adaptRoute(
    messagesController.getAllMessagesByChatPaginated.bind(messagesController)
  )
);

export default router;
