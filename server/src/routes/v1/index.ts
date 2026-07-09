import { Router } from "express";
import { authRoutes } from "../../modules/auth";
import { profileRoutes } from "../../modules/profile";
import { journalRoutes } from "../../modules/journal";
import { journalFolderRoutes } from "../../modules/journalFolder";
import { userSharingRoutes } from "../../modules/userSharing";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Profile routes
router.use("/profile", profileRoutes);

// Journal routes
router.use("/journal", journalRoutes);

// Journal Folder routes
router.use("/journal-folders", journalFolderRoutes);

// Contacts (UserSharing) routes
router.use("/contacts", userSharingRoutes);

export default router;
