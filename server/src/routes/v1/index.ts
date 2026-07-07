import { Router } from "express";
import { authRoutes, profileRoutes } from "../../modules/auth";
import { journalRoutes } from "../../modules/journal";
import { userSharingRoutes } from "../../modules/userSharing";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Profile routes
router.use("/profile", profileRoutes);

// Journal routes
router.use("/journal", journalRoutes);

// Contacts (UserSharing) routes
router.use("/contacts", userSharingRoutes);

export default router;
