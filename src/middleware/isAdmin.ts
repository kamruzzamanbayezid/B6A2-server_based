import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../config";

const isAdmin = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;

    req.user = decoded;

    if (roles.length && !roles.includes(decoded?.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access!",
      });
    }

    next();
  };
};

export default isAdmin;
