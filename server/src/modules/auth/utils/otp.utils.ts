import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IOtpTokenPayload } from "../types/auth.types";

/**
 * Generate a random 6-digit numeric OTP code
 */
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hash an OTP using bcrypt
 */
export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

/**
 * Compare plaintext OTP with bcrypt hash
 */
export const compareOtp = async (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};

/**
 * Sign a stateless JWT challenge token carrying email and hashed OTP
 */
export const signOtpToken = (email: string, otpHash: string): string => {
  const secret = process.env.OTP_JWT_SECRET || "default_otp_jwt_secret_dev_only";
  return jwt.sign({ email: email.toLowerCase(), otpHash }, secret, {
    expiresIn: "5m",
  });
};

/**
 * Verify and decode the stateless OTP JWT challenge token
 */
export const verifyOtpToken = (token: string): IOtpTokenPayload => {
  const secret = process.env.OTP_JWT_SECRET || "default_otp_jwt_secret_dev_only";
  return jwt.verify(token, secret) as IOtpTokenPayload;
};
