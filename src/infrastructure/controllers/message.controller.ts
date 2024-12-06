import { CreateMessageDTO } from "../../application/dtos/message-dtos/create-message.dto";
import { GetPaginatedMessageDTO } from "../../application/dtos/message-dtos/get-paginated-message.dto";
import { CreateMessageUseCase } from "../../application/use-cases/message-use-cases/create-message.use-case";
import { DeleteMessageUseCase } from "../../application/use-cases/message-use-cases/delete-message.use-case";
import { GetAllMessagesByChatPaginatedUseCase } from "../../application/use-cases/message-use-cases/get-all-messages-by-chat-paginated.use-case";
import { GetAllMessagesByChatUseCase } from "../../application/use-cases/message-use-cases/get-all-messages-by-chat.use-case";
import { GetMessageByIdUseCase } from "../../application/use-cases/message-use-cases/get-message-by-id.use-case";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";

export class MessageController {
  constructor(
    private readonly _createMessageUseCase: CreateMessageUseCase,
    private readonly _deleteMessageUseCase: DeleteMessageUseCase,
    private readonly _getMessageByIdUseCase: GetMessageByIdUseCase,
    private readonly _getAllMessagesByChatUseCase: GetAllMessagesByChatUseCase,
    private readonly _getAllMessagesByChatPaginated: GetAllMessagesByChatPaginatedUseCase
  ) {}

  async createMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      if (!req.body) {
        return { statusCode: 400, data: { error: "Message data is required" } };
      }

      const { chatId, senderId, content } = req.body;
      const messageDTO: CreateMessageDTO = {
        chatId,
        senderId,
        content,
      };

      const message = await this._createMessageUseCase.execute(messageDTO);
      if (!message) {
        return { statusCode: 400, data: { error: "Failed to create message" } };
      }

      return { statusCode: 201, data: message };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async deleteMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!id) {
        return { statusCode: 400, data: { error: "Message ID is required" } };
      }

      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      const message = await this._deleteMessageUseCase.execute(id);

      return { statusCode: 204, data: message };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getMessageById(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!id) {
        return { statusCode: 400, data: { error: "User ID is required" } };
      }

      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      const messageDTO = await this._getMessageByIdUseCase.execute(
        req.params.id
      );
      if (!messageDTO) {
        return {
          statusCode: 404,
          data: { message: "Message not found" },
        };
      }
      return { statusCode: 200, data: messageDTO };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getAllMessagesByChat(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id: chatId } = req.params;
      if (!chatId) {
        return { statusCode: 400, data: { error: "Chat ID is required" } };
      }

      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      const messages = await this._getAllMessagesByChatUseCase.execute(chatId);
      if (!messages) {
        return {
          statusCode: 404,
          data: { message: "Messages not found" },
        };
      }
      return { statusCode: 200, data: messages };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }

  async getAllMessagesByChatPaginated(
    req: IHttpRequest
  ): Promise<IHttpResponse> {
    try {
      const userId = req.user?.userId;
      const { id: chatId } = req.params;
      const { limit = "10", offset = "0" } = req.query;

      if (!chatId) {
        return { statusCode: 400, data: { error: "Chat ID is required" } };
      }

      if (!userId) {
        return { statusCode: 403, data: { error: "Access denied" } };
      }

      const parsedLimit = parseInt(limit as string, 10);
      const parsedOffset = parseInt(offset as string, 10);

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return { statusCode: 400, data: { error: "Invalid limit value" } };
      }

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return { statusCode: 400, data: { error: "Invalid offset value" } };
      }

      const getPaginatedMessageDTO: GetPaginatedMessageDTO = {
        chatId,
        limit: parsedLimit,
        offset: parsedOffset,
      };

      const messages = await this._getAllMessagesByChatPaginated.execute(
        getPaginatedMessageDTO
      );

      if (!messages || messages.length === 0) {
        return {
          statusCode: 404,
          data: { message: "Messages not found" },
        };
      }

      return { statusCode: 200, data: messages };
    } catch (error) {
      return { statusCode: 500, data: { error: (error as Error).message } };
    }
  }
}
