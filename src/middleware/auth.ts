import { NextFunction, Request, Response } from "express";
import { auth as betterauth } from "../lib/auth";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emaiilVerified: boolean;
      };
    }
  }
}

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //getting user session
    const session = await betterauth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "email verification required",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emaiilVerified: session.user.emailVerified,
    };
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "forbidden access",
      });
    }
    next();
  };
};