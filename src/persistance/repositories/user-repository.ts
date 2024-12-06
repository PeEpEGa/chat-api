import { User as DomainUser } from "../../domain/entities/user.entity";
import { UserModel, UserDocument } from "../models/user.model";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { handleRepositoryError } from "./utils/error-handler";

class UserRepository implements IUserRepository {
  constructor(private readonly _userModel: typeof UserModel) {}
  async create(data: Partial<DomainUser>): Promise<DomainUser> {
    try {
      const userDoc = await this._userModel.create({
        username: data.Username,
        name: data.Name,
        surname: data.Surname,
        email: data.Email,
        password: data.Password,
      });
      return this.toDomainEntity(userDoc);
    } catch (error) {
      handleRepositoryError("creating user", error);
    }
  }

  async findById(id: string): Promise<DomainUser | null> {
    try {
      const userDoc = await this._userModel.findById(id).exec();
      return userDoc ? this.toDomainEntity(userDoc) : null;
    } catch (error) {
      handleRepositoryError(`finding user with ID: ${id}`, error);
    }
  }

  async update(
    id: string,
    data: Partial<DomainUser>
  ): Promise<DomainUser | null> {
    try {
      const userDoc = await this._userModel
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .exec();
      return userDoc ? this.toDomainEntity(userDoc) : null;
    } catch (error) {
      handleRepositoryError(`updating user with ID: ${id}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this._userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      handleRepositoryError(`deleting user with ID: ${id}`, error);
    }
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    try {
      const userDoc = await this._userModel.findOne({ email }).exec();
      return userDoc ? this.toDomainEntity(userDoc) : null;
    } catch (error) {
      handleRepositoryError(`finding user with email: ${email}`, error);
    }
  }

  private toDomainEntity(userDoc: UserDocument): DomainUser {
    return new DomainUser(
      userDoc.id,
      userDoc.username,
      userDoc.name,
      userDoc.surname,
      userDoc.email,
      userDoc.password
    );
  }
}

export { UserRepository };
