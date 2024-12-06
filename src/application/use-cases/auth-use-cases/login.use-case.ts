import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { LoginDTO } from "../../dtos/auth-dtos/login.dto";
import { IPasswordService } from "../../services/interfaces/password-service.interface";
import { ITokenService } from "../../services/interfaces/token-service.interface";
import { BaseUseCase } from "../base.use-case";

export class LoginUseCase extends BaseUseCase<LoginDTO, string> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordService: IPasswordService,
    private readonly _tokenService: ITokenService
  ) {
    super();
  }

  async execute(data: LoginDTO): Promise<string> {
    try {
      const user = await this._userRepository.findByEmail(data.email);
      if (!user) {
        throw new Error("Failed to login: Invalid email or password");
      }
      const isPasswordValid = await this._passwordService.compare(
        data.password,
        user.Password
      );
      if (!isPasswordValid) {
        throw new Error("Failed to login: Invalid email or password");
      }
      return this._tokenService.generateToken(user.Id);
    } catch (error) {
      this.handleError(error, "Failed to login");
      throw new Error("Failed to login");
    }
  }
}
