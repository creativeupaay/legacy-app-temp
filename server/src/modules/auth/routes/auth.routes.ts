import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import {
  requestOtp,
  verifyOtp,
  completeOnboarding,
  refreshToken,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller";
import { protect, optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
  requestOtpSchema,
  verifyOtpSchema,
} from "../validators/auth.validator";

const router = Router();

// Rate limiters for brute-force and spam mitigation
const requestOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each email+IP to 3 OTP requests per window
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after 10 minutes.",
  },
  keyGenerator: (req) => `${ipKeyGenerator(req.ip || "127.0.0.1")}-${req.body?.email || ""}`,
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each email+IP to 5 verification attempts per window
  message: {
    success: false,
    message: "Too many incorrect verification attempts. Please try again after 5 minutes.",
  },
  keyGenerator: (req) => `${ipKeyGenerator(req.ip || "127.0.0.1")}-${req.body?.email || ""}`,
  standardHeaders: true,
  legacyHeaders: false,
});


// Public routes
router.post("/request-otp", requestOtpLimiter, validate(requestOtpSchema), requestOtp);
router.post("/verify-otp", verifyOtpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/refresh", refreshToken);

// Protected routes
router.post("/complete-onboarding", protect(), completeOnboarding);
router.post("/logout", protect(), logout);
router.get("/me", optionalAuth(), getCurrentUser);

export default router;
