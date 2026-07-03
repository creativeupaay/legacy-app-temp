import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  getProfileByUserId,
} from "../controllers/user.controller";
import { protect } from "../../auth/middlewares/auth.middleware";

const router = Router();

// All routes require an authenticated Primary User
router.use(protect());

// Profile routes
router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.get("/:userId", getProfileByUserId);

export default router;
