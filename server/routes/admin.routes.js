import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import authenticate from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// All routes in this file require SUPER_ADMIN role
router.use(authenticate);
router.use(authorizeRoles("SUPER_ADMIN"));

router.post("/doctors", adminController.createDoctor);

export default router;
