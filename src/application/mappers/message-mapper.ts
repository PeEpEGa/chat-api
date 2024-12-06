import { Message } from "../../domain/entities/message.entity";
import { CreateMessageDTO } from "../dtos/message-dtos/create-message.dto";
import { MessageDTO } from "../dtos/message-dtos/message.dto";

export class MessageMapper {
  static toDTO(message: Message): MessageDTO {
    return {
      id: message.messageId,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      timestamp: message.timestamp,
    };
  }

  static toDomain(dto: MessageDTO): Message {
    return new Message(dto.id, dto.chatId, dto.senderId, dto.content);
  }

  static toEntity(data: any): Message {
    return new Message(
      data.messageId,
      data.chatId,
      data.senderId,
      data.content
    );
  }
}
