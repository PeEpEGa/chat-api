import { Router } from "express";
import { setAuthRouteDependencies } from "./auth-route-setup";
import { adaptRoute } from "../../adapters/express-route-adapter";

const router: Router = Router();
const { authController, tokenService } = setAuthRouteDependencies();

router.post("/login", adaptRoute(authController.login.bind(authController)));

export default router;
