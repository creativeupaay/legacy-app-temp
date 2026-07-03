import { Router } from "express";
import { authRoutes } from "../../modules/auth";
import { userRoutes } from "../../modules/user";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Profile routes
router.use("/user", userRoutes);

export default router;
