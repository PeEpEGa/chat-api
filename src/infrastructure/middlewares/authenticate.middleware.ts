import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { userId: string };
  }
}

import { ITokenService } from "../../application/services/interfaces/token-service.interface";

export const authenticate = (tokenService: ITokenService) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Authorization header is required" });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
      }

      const payload = tokenService.verifyToken(token);

      req.user = { userId: payload.userId };
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
};
