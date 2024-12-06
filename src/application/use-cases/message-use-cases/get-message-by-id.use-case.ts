import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { MessageDTO } from "../../dtos/message-dtos/message.dto";
import { MessageMapper } from "../../mappers/message-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetMessageByIdUseCase extends BaseUseCase<string, MessageDTO> {
  constructor(private readonly _messageRepository: IMessageRepository) {
    super();
  }

  async execute(id: string): Promise<MessageDTO> {
    try {
      const message = await this._messageRepository.findById(id);
      if (!message) {
        throw new Error("Failed to get message: Message not found");
      }
      return MessageMapper.toDTO(message);
    } catch (error) {
      this.handleError(error, "Failed to get message");
      throw new Error("Failed to get message");
    }
  }
}
