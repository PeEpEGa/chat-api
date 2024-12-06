import { LoginDTO } from "../../application/dtos/auth-dtos/login.dto";
import { LoginUseCase } from "../../application/use-cases/auth-use-cases/login.use-case";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";

export class AuthController {
  constructor(private readonly _loginUseCase: LoginUseCase) {}

  async login(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!req.body) {
        return { statusCode: 400, data: { error: "Login data is required" } };
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return {
          statusCode: 400,
          data: { error: "Email and password are required" },
        };
      }

      const loginDTO: LoginDTO = {
        email,
        password,
      };

      const token = await this._loginUseCase.execute(loginDTO);

      return { statusCode: 200, data: { token } };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }
}
