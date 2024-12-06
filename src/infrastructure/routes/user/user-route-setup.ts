import { CreateUserUseCase } from "../../../application/use-cases/user-use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/user-use-cases/delete-user.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/user-use-cases/get-user-by-id.use-case";
import { PasswordService } from "../../../application/services/password-service";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { RepositoryManager } from "../../../persistance/repositories/repository";
import { UserModel } from "../../../persistance/models/user.model";
import { UserController } from "../../controllers/user.controller";
import { TokenService } from "../../../application/services/token-service";

export function setUserRouteDependencies(mockRepository?: IUserRepository) {
  const userRepository =
    mockRepository || RepositoryManager.getUserRepository(UserModel);

  const passwordService = new PasswordService();
  const tokenService = new TokenService();

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    passwordService
  );
  const getUserUseCase = new GetUserByIdUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const userController = new UserController(
    createUserUseCase,
    getUserUseCase,
    deleteUserUseCase
  );

  return { userController, tokenService };
}
