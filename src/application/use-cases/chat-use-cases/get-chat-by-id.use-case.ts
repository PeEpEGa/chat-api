import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { ChatDTO } from "../../dtos/chat-dtos/chat-dto";
import { ChatMapper } from "../../mappers/chat-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetChatByIdUseCase extends BaseUseCase<string, ChatDTO> {
  constructor(private readonly _chatRepository: IChatRepository) {
    super();
  }

  async execute(id: string): Promise<ChatDTO> {
    try {
      const chat = await this._chatRepository.findById(id);
      if (!chat) {
        throw new Error(`Failed to get chat by ID: ${id}`);
      }
      return ChatMapper.toDTO(chat);
    } catch (error) {
      this.handleError(error, `Failed to get chat by ID: ${id}`);
      throw new Error(`Failed to get chat by ID: ${id}`);
    }
  }
}
