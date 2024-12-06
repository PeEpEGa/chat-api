import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { setChatRouteDependencies } from "./chats-route-setup";

const router: Router = Router();
const { chatController, tokenService } = setChatRouteDependencies();

router.post(
  "/",
  authenticate(tokenService),
  adaptRoute(chatController.createChat.bind(chatController))
);
router.get(
  "/:id",
  authenticate(tokenService),
  adaptRoute(chatController.getChatById.bind(chatController))
);
router.get(
  "/",
  authenticate(tokenService),
  adaptRoute(chatController.getChatsByUserId.bind(chatController))
);
router.delete(
  "/:id",
  authenticate(tokenService),
  adaptRoute(chatController.deleteChat.bind(chatController))
);

export default router;
