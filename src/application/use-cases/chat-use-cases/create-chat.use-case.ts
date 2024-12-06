import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { ChatDTO } from "../../dtos/chat-dtos/chat-dto";
import { CreateChatDTO } from "../../dtos/chat-dtos/create-chat.dto";
import { ChatMapper } from "../../mappers/chat-mapper";
import { IIdGenerator } from "../../services/interfaces/id-generator.interface";
import { BaseUseCase } from "../base.use-case";

export class CreateChatUseCase extends BaseUseCase<CreateChatDTO, ChatDTO> {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _idGenerator: IIdGenerator
  ) {
    super();
  }

  async execute(data: CreateChatDTO): Promise<ChatDTO> {
    try {
      const [userId1, userId2] = data.userIds;

      const user1 = await this._userRepository.findById(userId1);
      const user2 = await this._userRepository.findById(userId2);

      if (!user1 || !user2) {
        throw new Error(
          "Failed to create chat: One or both users do not exist"
        );
      }

      const existingChat = await this._chatRepository.findByUserIds(
        data.userIds
      );
      if (existingChat) {
        throw new Error("Failed to create chat: Chat already exists");
      }

      const id = this._idGenerator.generateId();
      const chat = ChatMapper.toEntity({
        id,
        userIds: data.userIds,
        unreadMessages: 0,
      });

      const createdChat = await this._chatRepository.create(chat);
      return ChatMapper.toDTO(createdChat);
    } catch (error) {
      this.handleError(error, "Failed to create chat");
      throw new Error("Failed to create chat");
    }
  }
}
