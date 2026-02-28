import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      msg: "Not Authorizated to access",
    });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded !== "object" || !decoded.id) {
      return res.status(403).json({
        msg: "Not Authorizated to access",
      });
    }

    req.userid = decoded.id as string;
    next();
  } catch (e) {
    return res.status(401).json({ msg: e });
  }
};
