import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { CreateMessageDTO } from "../../dtos/message-dtos/create-message.dto";
import { MessageDTO } from "../../dtos/message-dtos/message.dto";
import { IQuoteService } from "../../services/interfaces/quote-service.interface";
import { BaseUseCase } from "../base.use-case";
import { CreateMessageUseCase } from "./create-message.use-case";

export class AutoResponseUseCase extends BaseUseCase<
  CreateMessageDTO,
  MessageDTO
> {
  constructor(
    private readonly _createMessageUseCase: CreateMessageUseCase,
    private readonly _chatRepository: IChatRepository,
    private readonly _quoteService: IQuoteService
  ) {
    super();
  }

  async execute(data: CreateMessageDTO): Promise<MessageDTO> {
    try {
      const chat = await this._chatRepository.findById(data.chatId);
      if (!chat) {
        throw new Error("Failed to generate auto-response: Chat not found");
      }

      const autoResponseContent = await this._quoteService.getQuote();

      const autoResponseMessage: CreateMessageDTO = {
        chatId: data.chatId,
        senderId: chat.getAnotherUserId(data.senderId),
        content: autoResponseContent,
        isAutoResponse: true,
      };

      return await this._createMessageUseCase.execute(autoResponseMessage);
    } catch (error) {
      this.handleError(error, "Failed to generate auto-response");
      throw new Error("Failed to generate auto-response");
    }
  }
}
