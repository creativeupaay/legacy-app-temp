import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { updateProfileSchema } from "../validators/profile.validator";
import { uploadImage } from "../../../middlewares/upload.middleware";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getProfileInsights,
} from "../controllers/profile.controller";

const router = Router();

router.use(protect());

// Get profile
router.get("/", getProfile);
router.get("/me", getProfile);

// Update profile
router.patch("/", validate(updateProfileSchema), updateProfile);
router.put("/", validate(updateProfileSchema), updateProfile);
router.patch("/me", validate(updateProfileSchema), updateProfile);
router.put("/me", validate(updateProfileSchema), updateProfile);

// Upload profile image
router.post("/upload-image", uploadImage.single("image"), uploadProfileImage);

// Get insights
router.get("/insights", getProfileInsights);

export default router;
