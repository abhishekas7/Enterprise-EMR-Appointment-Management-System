import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authenticate, authController.logout);

router.get("/me", authenticate, authController.me);

export default router;