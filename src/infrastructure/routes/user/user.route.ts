import express from "express";
import { setUserRouteDependencies } from "./user-route-setup";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { authenticate } from "../../middlewares/authenticate.middleware";

const router = express.Router();
const { userController, tokenService } = setUserRouteDependencies();

router.post("/", adaptRoute(userController.createUser.bind(userController)));
router.get(
  "/:id",
  authenticate(tokenService),
  adaptRoute(userController.getUserById.bind(userController))
);
router.delete(
  "/:id",
  authenticate(tokenService),
  adaptRoute(userController.deleteUser.bind(userController))
);

export default router;
