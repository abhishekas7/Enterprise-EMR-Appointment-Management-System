import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/authMiddleware.js";
import { validateLoginInput } from "../middleware/validation.middleware.js";

const router = Router();

// POST /api/v1/auth/login
// validateLoginInput runs first — returns 400/422 before the controller is hit
router.post("/login", validateLoginInput, authController.login);

// POST /api/v1/auth/refresh
router.post("/refresh", authController.refreshToken);

// POST /api/v1/auth/logout  (requires valid access token)
router.post("/logout", authenticate, authController.logout);

// GET /api/v1/auth/me  (returns current user from token)
router.get("/me", authenticate, authController.me);

export default router;