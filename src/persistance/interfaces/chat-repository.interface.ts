import { Chat } from "../../domain/entities/chat.entity";
import { Message } from "../../domain/entities/message.entity";
import { ISession } from "./session.interface";

export interface IChatRepository {
  create(data: Chat): Promise<Chat>;
  findById(id: string): Promise<Chat | null>;
  findByUserIds(userIds: [string, string]): Promise<Chat | null>;
  findChatsByUserId(userId: string): Promise<Chat[]>;
  update(id: string, data: Partial<Chat>): Promise<Chat | null>;
  delete(id: string, session?: ISession): Promise<void>;
  updateLastMessage(
    chatId: string,
    lastMessage: Message,
    session?: ISession
  ): Promise<void>;
}
