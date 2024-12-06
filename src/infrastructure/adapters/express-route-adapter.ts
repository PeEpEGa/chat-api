import { Request, Response } from "express";
import { IController } from "../interfaces/controller.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user,
    };

    const httpResponse = await controller(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.data);
  };
};
