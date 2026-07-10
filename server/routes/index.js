import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

// Health Check
router.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Enterprise EMR API is running",
        data: {
            version: "v1",
            status: "OK"
        },
        meta: {
            timestamp: new Date().toISOString()
        }
    });
});

router.use("/auth", authRoutes);

export default router;