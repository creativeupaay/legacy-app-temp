import { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError";
import { verifyAccessToken, COOKIE_NAMES } from "../utils/jwt.utils";
import { ITokenPayload } from "../types/auth.types";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

/**
 * Middleware to protect routes — verifies the access token cookie.
 * No role arguments: there is only one authenticated identity.
 */
export const protect = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check fixed cookie name
    token = req.cookies[COOKIE_NAMES.accessToken];

    // Fallback: Bearer header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Not authorized - No token provided", 401);
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new AppError("Not authorized - Invalid or expired token", 401);
    }

    req.user = decoded;
    next();
  };
};

/**
 * Middleware to optionally authenticate — attaches user if a valid token
 * exists, does not throw if absent.
 */
export const optionalAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies[COOKIE_NAMES.accessToken] ??
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  };
};
