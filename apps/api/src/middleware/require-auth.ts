import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = {
  sub: string;
  email: string;
  role: string;
  fullName: string;
};

export type AuthedRequest = Request & {
  authUser?: AuthUser;
};

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header." });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthUser;
    req.authUser = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
