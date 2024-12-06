import { User } from "../../domain/entities/user.entity";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
