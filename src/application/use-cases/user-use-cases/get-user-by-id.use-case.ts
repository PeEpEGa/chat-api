import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { UserDTO } from "../../dtos/user-dtos/user.dto";
import { UserMapper } from "../../mappers/user-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetUserByIdUseCase extends BaseUseCase<string, UserDTO> {
  constructor(private readonly _userRepository: IUserRepository) {
    super();
  }

  async execute(id: string): Promise<UserDTO> {
    try {
      const user = await this._userRepository.findById(id);
      if (!user) {
        throw new Error("Failed to get user: User not found");
      }
      return UserMapper.toDTO(user);
    } catch (error) {
      this.handleError(error, "Failed to get user");
      throw new Error("Failed to get user");
    }
  }
}
