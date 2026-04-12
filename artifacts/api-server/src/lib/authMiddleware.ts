import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET ?? "patent-secret-change-me";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as {
      userId: string;
      name: string;
      email: string;
      picture: string | null;
    };
    (req as any).userId = payload.userId;
    (req as any).userName = payload.name;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
