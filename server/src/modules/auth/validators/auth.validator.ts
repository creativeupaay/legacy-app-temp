import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  otp: z
    .string({ message: "OTP is required" })
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  otpToken: z
    .string({ message: "otpToken is required" })
    .min(1, "otpToken is required"),
});

export const completeOnboardingSchema = z.object({}).strict();
// no body expected — userId comes from the authenticated session via
// protect(), not the request body. Keep this here for consistency /
// future fields, even if empty now.

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
