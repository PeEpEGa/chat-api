import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { GetPaginatedMessageDTO } from "../../dtos/message-dtos/get-paginated-message.dto";
import { MessageDTO } from "../../dtos/message-dtos/message.dto";
import { MessageMapper } from "../../mappers/message-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetAllMessagesByChatPaginatedUseCase extends BaseUseCase<
  GetPaginatedMessageDTO,
  MessageDTO[]
> {
  constructor(private readonly _messageRepository: IMessageRepository) {
    super();
  }

  async execute(data: GetPaginatedMessageDTO): Promise<MessageDTO[]> {
    try {
      const messages = await this._messageRepository.findAllByChatPaginated(
        data.chatId,
        data.limit,
        data.offset
      );
      if (!messages) {
        throw new Error("Failed to get messages: Messages not found");
      }
      return messages.map((message) => MessageMapper.toDTO(message));
    } catch (error) {
      this.handleError(error, "Failed to get all messages by chat paginated");
      throw new Error("Failed to get all messages by chat paginated");
    }
  }
}
