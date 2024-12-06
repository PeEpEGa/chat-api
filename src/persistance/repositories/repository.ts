import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
import { UserModel } from "../models/user.model";
import { ChatRepository } from "./chat-repository";
import { MessageRepository } from "./message-repository";
import { UserRepository } from "./user-repository";

export class RepositoryManager {
  private static _messageRepository: MessageRepository;
  private static _userRepository: UserRepository;
  private static _chatRepository: ChatRepository;

  public static setMessageRepository(
    messageRepository: MessageRepository
  ): void {
    this._messageRepository = messageRepository;
  }

  public static getMessageRepository(
    messageModel: typeof MessageModel
  ): MessageRepository {
    if (!this._messageRepository) {
      return new MessageRepository(messageModel);
    }
    return this._messageRepository;
  }

  public static setUserRepository(userRepository: UserRepository): void {
    this._userRepository = userRepository;
  }

  public static getUserRepository(userModel: typeof UserModel): UserRepository {
    if (!this._userRepository) {
      return new UserRepository(userModel);
    }
    return this._userRepository;
  }

  public static setChatRepository(chatRepository: ChatRepository): void {
    this._chatRepository = chatRepository;
  }

  public static getChatRepository(chatModel: typeof ChatModel): ChatRepository {
    if (!this._chatRepository) {
      return new ChatRepository(chatModel);
    }
    return this._chatRepository;
  }
}
