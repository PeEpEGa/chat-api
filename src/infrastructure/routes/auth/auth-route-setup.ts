import { PasswordService } from "../../../application/services/password-service";
import { TokenService } from "../../../application/services/token-service";
import { LoginUseCase } from "../../../application/use-cases/auth-use-cases/login.use-case";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { UserModel } from "../../../persistance/models/user.model";
import { RepositoryManager } from "../../../persistance/repositories/repository";
import { AuthController } from "../../controllers/auth.controller";

export function setAuthRouteDependencies(mockRepository?: IUserRepository) {
  const userRepository =
    mockRepository || RepositoryManager.getUserRepository(UserModel);

  const passwordService = new PasswordService();
  const tokenService = new TokenService();

  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordService,
    tokenService
  );

  const authController = new AuthController(loginUseCase);

  return { authController, tokenService };
}
