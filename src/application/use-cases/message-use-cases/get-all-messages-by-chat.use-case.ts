import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { MessageDTO } from "../../dtos/message-dtos/message.dto";
import { MessageMapper } from "../../mappers/message-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetAllMessagesByChatUseCase extends BaseUseCase<
  string,
  MessageDTO[]
> {
  constructor(private readonly _messageRepository: IMessageRepository) {
    super();
  }

  async execute(chatId: string): Promise<MessageDTO[]> {
    try {
      const messages = await this._messageRepository.findAllByChat(chatId);
      if (!messages) {
        throw new Error("Failed to get messages: Messages not found");
      }

      return messages.map((message) => MessageMapper.toDTO(message));
    } catch (error) {
      this.handleError(error, "Failed to get all messages by chat");
      throw new Error("Failed to get all messages by chat");
    }
  }
}
