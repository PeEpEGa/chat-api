import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { ChatDTO } from "../../dtos/chat-dtos/chat-dto";
import { ChatMapper } from "../../mappers/chat-mapper";
import { BaseUseCase } from "../base.use-case";

export class GetChatsByUserIdUseCase extends BaseUseCase<string, ChatDTO[]> {
  constructor(private readonly _chatRepository: IChatRepository) {
    super();
  }

  async execute(userId: string): Promise<ChatDTO[]> {
    try {
      const chats = await this._chatRepository.findChatsByUserId(userId);
      if (!chats) {
        throw new Error(`Failed to get chats by user ID: ${userId}`);
      }
      return chats.map((chat) => ChatMapper.toDTO(chat));
    } catch (error) {
      this.handleError(error, `Failed to get chat by user ID: ${userId}`);
      throw new Error(`Failed to get chat by user ID: ${userId}`);
    }
  }
}
