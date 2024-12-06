import { Chat } from "../../domain/entities/chat.entity";
import { ChatDTO } from "../dtos/chat-dtos/chat-dto";
import { MessageMapper } from "./message-mapper";
import { MessageDTO } from "../dtos/message-dtos/message.dto";

export class ChatMapper {
  static toEntity(data: {
    id: string;
    userIds: [string, string];
    unreadMessages: number;
    updatedAt?: Date;
    lastMessage?: MessageDTO;
  }): Chat {
    const lastMessageDomain = data.lastMessage
      ? MessageMapper.toDomain(data.lastMessage)
      : undefined;

    return new Chat(
      data.id,
      data.userIds,
      data.unreadMessages,
      data.updatedAt,
      lastMessageDomain
    );
  }

  static toDTO(chat: Chat): ChatDTO {
    const json = chat.toJSON();
    const lastMessageDTO = json.lastMessage
      ? MessageMapper.toDTO(json.lastMessage)
      : undefined;

    return {
      id: json.id,
      userIds: json.userIds,
      lastMessage: lastMessageDTO,
      unreadMessages: json.unreadMessages,
      updatedAt: json.updatedAt,
    };
  }
}
