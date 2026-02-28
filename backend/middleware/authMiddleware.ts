import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!secret) return res.status(500).json({ msg: "JWT secret not configured" });

  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      msg: "Not Authorizated to access",
    });
  }

  try {
    const authToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!authToken) {
      return res.status(401).json({ msg: "Not Authorised" });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as JwtPayload;
    console.log(decoded);

    if (typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({
        msg: "Not Authorizated to access",
      });
    }

    req.userid = decoded.id as string;
    next();
  } catch (e) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
