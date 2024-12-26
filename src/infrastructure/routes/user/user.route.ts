import express from "express";
import dotenv from "dotenv";
import { setUserRouteDependencies } from "./user-route-setup";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { createClientLimiter } from "../../middlewares/client-limiter";

const router = express.Router();
const { userController, tokenService } = setUserRouteDependencies();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "";

const limiter = createClientLimiter(5, JWT_SECRET);

router.post("/", adaptRoute(userController.createUser.bind(userController)));
router.get(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(userController.getUserById.bind(userController))
);
router.delete(
  "/:id",
  limiter,
  authenticate(tokenService),
  adaptRoute(userController.deleteUser.bind(userController))
);

export default router;
