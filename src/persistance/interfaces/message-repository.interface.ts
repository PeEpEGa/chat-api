import { Message } from "../../domain/entities/message.entity";
import { ISession } from "./session.interface";

export interface IMessageRepository {
  create(data: Message, session?: ISession): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findAllByChat(chatId: string): Promise<Message[] | null>;
  findAllByChatPaginated(
    chatId: string,
    limit: number,
    offset: number
  ): Promise<Message[] | null>;
  update(id: string, data: Partial<Message>): Promise<Message | null>;
  delete(id: string): Promise<void>;
  deleteAllMessages(chatId: string, session?: ISession): Promise<void>;
}
