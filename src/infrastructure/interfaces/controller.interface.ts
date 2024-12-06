import { IHttpRequest } from "./http-request.interface";
import { IHttpResponse } from "./http-response.interface";

export interface IController {
  (req: IHttpRequest): Promise<IHttpResponse>;
}
