import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors, // { email: ["Enter a valid email address"], ... }
      });
      return;
    }
    req.body = result.data; // overwrite with parsed/coerced data (trimmed,
                            // lowercased email, etc.) so the controller
                            // always receives clean input
    next();
  };
