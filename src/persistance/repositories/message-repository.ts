import { Message as DomainMessage } from "../../domain/entities/message.entity";
import { IMessageRepository } from "../interfaces/message-repository.interface";
import { MessageDocument, MessageModel } from "../models/message.model";
import { handleRepositoryError } from "./utils/error-handler";
import { ISession } from "../interfaces/session.interface";
import { ClientSession } from "mongoose";

export class MessageRepository implements IMessageRepository {
  constructor(private readonly _messageModel: typeof MessageModel) {}

  async create(
    data: DomainMessage,
    session?: ISession
  ): Promise<DomainMessage> {
    try {
      let clientSession;
      if (session) {
        clientSession = (
          session as unknown as { getClientSession: () => ClientSession }
        ).getClientSession();
      }

      const messageData = {
        _id: data.messageId,
        chatId: data.chatId,
        senderId: data.senderId,
        content: data.content,
        timestamp: data.timestamp,
      };

      const saveOptions = session ? { session: clientSession } : {};

      const messageDoc = await this._messageModel.create(
        [messageData],
        saveOptions
      );

      return this.toDomainEntity(messageDoc[0]);
    } catch (error) {
      handleRepositoryError("creating message", error);
    }
  }

  async findById(id: string): Promise<DomainMessage | null> {
    try {
      const messageDoc = await this._messageModel.findById(id).exec();
      return messageDoc ? this.toDomainEntity(messageDoc) : null;
    } catch (error) {
      handleRepositoryError(`finding message with ID: ${id}`, error);
    }
  }

  async findAllByChat(chatId: string): Promise<DomainMessage[]> {
    try {
      const messageDocs = await this._messageModel.find({ chatId }).exec();
      return messageDocs.map(this.toDomainEntity);
    } catch (error) {
      handleRepositoryError(`finding messages by chat ID: ${chatId}`, error);
    }
  }

  async findAllByChatPaginated(
    chatId: string,
    limit: number,
    offset: number
  ): Promise<DomainMessage[]> {
    try {
      const messageDocs = await this._messageModel
        .find({ chatId })
        .skip(offset)
        .limit(limit)
        .exec();
      return messageDocs.map(this.toDomainEntity);
    } catch (error) {
      handleRepositoryError(`finding messages by chat ID: ${chatId}`, error);
    }
  }

  async update(
    id: string,
    data: Partial<DomainMessage>
  ): Promise<DomainMessage | null> {
    try {
      const messageDoc = await this._messageModel
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .exec();
      return messageDoc ? this.toDomainEntity(messageDoc) : null;
    } catch (error) {
      handleRepositoryError(`updating message with ID: ${id}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await MessageModel.findByIdAndDelete(id).exec();
    } catch (error) {
      handleRepositoryError(`deleting message with ID: ${id}`, error);
    }
  }

  async deleteAllMessages(chatId: string, session?: ISession): Promise<void> {
    try {
      let clientSession;
      if (session) {
        clientSession = (
          session as unknown as { getClientSession: () => ClientSession }
        ).getClientSession();
      }
      await this._messageModel.deleteMany({ chatId }, { clientSession }).exec();
    } catch (error) {
      handleRepositoryError(
        `deleting all messages for chat ID: ${chatId}`,
        error
      );
    }
  }

  private toDomainEntity(messageDoc: MessageDocument): DomainMessage {
    return new DomainMessage(
      messageDoc._id,
      messageDoc.chatId,
      messageDoc.senderId,
      messageDoc.content
    );
  }
}
