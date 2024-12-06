import { CreateUserDTO } from "../../application/dtos/user-dtos/create-user.dto";
import { CreateUserUseCase } from "../../application/use-cases/user-use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/user-use-cases/delete-user.use-case";
import { GetUserByIdUseCase } from "../../application/use-cases/user-use-cases/get-user-by-id.use-case";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";

export class UserController {
  constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _getUserUseCase: GetUserByIdUseCase,
    private readonly _deleteUserUseCase: DeleteUserUseCase
  ) {}

  async createUser(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!req.body) {
        return { statusCode: 400, data: { error: "User data is required" } };
      }

      const { username, name, surname, email, password } = req.body;

      if (!username || !name || !surname || !email || !password) {
        return { statusCode: 400, data: { error: "All fields are required" } };
      }

      const createUserDTO: CreateUserDTO = {
        username,
        name,
        surname,
        email,
        password,
      };

      const userDTO = await this._createUserUseCase.execute(createUserDTO);

      return { statusCode: 201, data: userDTO };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getUserById(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!id) {
        return { statusCode: 400, data: { error: "User ID is required" } };
      }

      if (id !== userId) {
        return {
          statusCode: 403,
          data: { error: "Access denied" },
        };
      }

      const userDTO = await this._getUserUseCase.execute(id);

      if (!userDTO) {
        return {
          statusCode: 404,
          data: { message: "User not found" },
        };
      }

      return {
        statusCode: 200,
        data: userDTO,
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: { error: (error as Error).message },
      };
    }
  }

  async deleteUser(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!id) {
        return { statusCode: 400, data: { error: "User ID is required" } };
      }

      if (id !== userId) {
        return {
          statusCode: 403,
          data: { error: "Access denied" },
        };
      }

      await this._deleteUserUseCase.execute(req.params.id);

      return { statusCode: 204, data: null };
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        return { statusCode: 404, data: { error: (error as Error).message } };
      } else {
        return { statusCode: 500, data: { error: (error as Error).message } };
      }
    }
  }
}
