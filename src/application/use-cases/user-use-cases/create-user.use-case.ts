import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { CreateUserDTO } from "../../dtos/user-dtos/create-user.dto";
import { UserDTO } from "../../dtos/user-dtos/user.dto";
import { UserMapper } from "../../mappers/user-mapper";
import { IPasswordService } from "../../services/interfaces/password-service.interface";
import { BaseUseCase } from "../base.use-case";

export class CreateUserUseCase extends BaseUseCase<CreateUserDTO, UserDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordService: IPasswordService
  ) {
    super();
  }

  async execute(data: CreateUserDTO): Promise<UserDTO> {
    try {
      const existingUser = await this._userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("Failed to create user: Email already in use");
      }

      const hashedPassword = await this._passwordService.hash(data.password);
      const user = UserMapper.toDomain({ ...data, password: hashedPassword });

      const createdUser = await this._userRepository.create(user);

      return UserMapper.toDTO(createdUser);
    } catch (error) {
      this.handleError(error, "Failed to create user");
      throw new Error("Failed to create user");
    }
  }
}
