import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { BaseUseCase } from "../base.use-case";

export class DeleteUserUseCase extends BaseUseCase<string, void> {
  constructor(private readonly _userRepository: IUserRepository) {
    super();
  }

  async execute(id: string): Promise<void> {
    try {
      const user = await this._userRepository.findById(id);
      if (!user) {
        throw new Error("Failed to delete user: User not found");
      }

      await this._userRepository.delete(id);
    } catch (error) {
      this.handleError(error, "Failed to delete user");
      throw new Error("Failed to delete user");
    }
  }
}
