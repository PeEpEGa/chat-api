import { IPasswordService } from "./interfaces/password-service.interface";
import bcrypt from "bcrypt";

export class PasswordService implements IPasswordService {
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
}
