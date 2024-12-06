import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenService } from "./interfaces/token-service.interface";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY as string;

export class TokenService implements ITokenService {
  generateToken(userId: string): string {
    return jwt.sign({ userId }, secretKey, { expiresIn: "7d" });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
