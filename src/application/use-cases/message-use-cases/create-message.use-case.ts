import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { ISessionFactory } from "../../../persistance/interfaces/session.interface";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { CreateMessageDTO } from "../../dtos/message-dtos/create-message.dto";
import { MessageDTO } from "../../dtos/message-dtos/message.dto";
import { messageEvents } from "../../events/message-events";
import { MessageMapper } from "../../mappers/message-mapper";
import { IIdGenerator } from "../../services/interfaces/id-generator.interface";
import { BaseUseCase } from "../base.use-case";

export class CreateMessageUseCase extends BaseUseCase<
  CreateMessageDTO,
  MessageDTO
> {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _chatRepository: IChatRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _idGenerator: IIdGenerator,
    private readonly _sessionFactory: ISessionFactory
  ) {
    super();
  }

  async execute(messageData: CreateMessageDTO): Promise<MessageDTO> {
    try {
      const chat = await this._chatRepository.findById(messageData.chatId);
      const user = await this._userRepository.findById(messageData.senderId);

      if (!chat || !user) {
        throw new Error("Failed to create message: Chat or user not found");
      }

      const isUserInChat = chat.userIds.includes(messageData.senderId);
      if (!isUserInChat) {
        throw new Error("Failed to create message: User not in chat");
      }

      const messageId = this._idGenerator.generateId();
      if (!messageId) {
        throw new Error("Failed to create message: ID generation failed");
      }

      const message = MessageMapper.toEntity({
        messageId,
        ...messageData,
      });

      const createdMessage = await this._messageRepository.create(message);

      await this._chatRepository.updateLastMessage(chat.chatId, message);

      if (!messageData.isAutoResponse) {
        messageEvents.emit("messageCreated", messageData);
      }

      return MessageMapper.toDTO(createdMessage);
    } catch (error) {
      console.error("Error during message creation:", error);
      throw new Error("Failed to create message");
    }
  }
}
