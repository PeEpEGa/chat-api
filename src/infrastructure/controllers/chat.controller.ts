import { ChatDTO } from "../../application/dtos/chat-dtos/chat-dto";
import { CreateChatDTO } from "../../application/dtos/chat-dtos/create-chat.dto";
import { CreateChatUseCase } from "../../application/use-cases/chat-use-cases/create-chat.use-case";
import { DeleteChatUseCase } from "../../application/use-cases/chat-use-cases/delete-chat.use-case";
import { GetChatByIdUseCase } from "../../application/use-cases/chat-use-cases/get-chat-by-id.use-case";
import { GetChatsByUserIdUseCase } from "../../application/use-cases/chat-use-cases/get-chats-by-user-id.use-case";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";

export class ChatController {
  constructor(
    private readonly _createChatUseCase: CreateChatUseCase,
    private readonly _deleteChatUseCase: DeleteChatUseCase,
    private readonly _getChatByIdUseCase: GetChatByIdUseCase,
    private readonly _getChatsByUserIdUseCase: GetChatsByUserIdUseCase
  ) {}

  async createChat(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return {
          statusCode: 403,
          data: { error: "Access denied" },
        };
      }

      if (!req.body) {
        return { statusCode: 400, data: { error: "Chat data is required" } };
      }

      const { userIds } = req.body;

      if (!userIds || userIds.length < 2 || !userIds.includes(userId)) {
        return {
          statusCode: 400,
          data: { error: "You must include yourself in the chat" },
        };
      }

      const chatDTO: CreateChatDTO = { userIds };

      const chat = await this._createChatUseCase.execute(chatDTO);

      return { statusCode: 201, data: chat };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getChatById(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!id) {
        return { statusCode: 400, data: { error: "Chat ID is required" } };
      }

      const chatDTO = await this._getChatByIdUseCase.execute(id);

      if (!chatDTO) {
        return {
          statusCode: 404,
          data: { message: "Chat not found" },
        };
      }

      if (!userId || !chatDTO.userIds.includes(userId)) {
        return {
          statusCode: 403,
          data: { error: "Access denied" },
        };
      }

      return { statusCode: 200, data: chatDTO };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getChatsByUserId(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      const chats = await this._getChatsByUserIdUseCase.execute(userId);

      if (!chats || chats.length === 0) {
        return {
          statusCode: 404,
          data: { message: "No chats found" },
        };
      }

      return { statusCode: 200, data: chats };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async deleteChat(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!id) {
        return { statusCode: 400, data: { error: "Chat ID is required" } };
      }

      const chatDTO = await this._getChatByIdUseCase.execute(id);

      if (!chatDTO) {
        return {
          statusCode: 404,
          data: { error: "Chat not found" },
        };
      }

      if (!userId || !chatDTO.userIds.includes(userId)) {
        return {
          statusCode: 403,
          data: { error: "Access denied" },
        };
      }

      await this._deleteChatUseCase.execute(id);

      return { statusCode: 204, data: null };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }
}
