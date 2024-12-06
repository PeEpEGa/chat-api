import { Chat as DomainChat } from "../../domain/entities/chat.entity";
import { ChatModel, ChatDocument } from "../models/chat.model";
import { IChatRepository } from "../interfaces/chat-repository.interface";
import { handleRepositoryError } from "./utils/error-handler";
import { ISession } from "../interfaces/session.interface";
import { ClientSession } from "mongoose";
import { Message } from "../../domain/entities/message.entity";

class ChatRepository implements IChatRepository {
  constructor(private readonly _chatModel: typeof ChatModel) {}

  async create(data: Partial<DomainChat>): Promise<DomainChat> {
    try {
      const chatDoc = await this._chatModel.create({
        _id: data.chatId,
        userIds: data.userIds,
        lastMessage: data.lastMessage ? data.lastMessage.toJSON() : null,
        unreadMessages: data.unreadMessages || 0,
        updatedAt: data.updatedAt || new Date(),
      });
      return this.toDomainEntity(chatDoc);
    } catch (error) {
      handleRepositoryError("creating chat", error);
    }
  }

  async findById(id: string): Promise<DomainChat | null> {
    try {
      const chatDoc = await this._chatModel.findById(id).exec();
      return chatDoc ? this.toDomainEntity(chatDoc) : null;
    } catch (error) {
      handleRepositoryError(`finding chat with ID: ${id}`, error);
    }
  }

  async update(
    id: string,
    data: Partial<DomainChat>
  ): Promise<DomainChat | null> {
    try {
      const updateData: Partial<ChatDocument> = {
        ...(data.userIds && { userIds: data.userIds }),
        ...(data.lastMessage && { lastMessage: data.lastMessage }),
        ...(data.unreadMessages !== undefined && {
          unreadMessages: data.unreadMessages,
        }),
        ...(data.updatedAt && { updatedAt: data.updatedAt }),
      };

      const chatDoc = await this._chatModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      return chatDoc ? this.toDomainEntity(chatDoc) : null;
    } catch (error) {
      handleRepositoryError(`updating chat with ID: ${id}`, error);
    }
  }

  async delete(id: string, session?: ISession): Promise<void> {
    try {
      let clientSession;
      if (session) {
        clientSession = (
          session as unknown as { getClientSession: () => ClientSession }
        ).getClientSession();
      }

      await this._chatModel
        .findByIdAndDelete(id, { session: clientSession })
        .exec();
    } catch (error) {
      handleRepositoryError(`deleting chat with ID: ${id}`, error);
    }
  }

  async findByUserIds(userIds: [string, string]): Promise<DomainChat | null> {
    try {
      const chatDoc = await this._chatModel
        .findOne({ userIds: { $all: userIds } })
        .exec();
      return chatDoc ? this.toDomainEntity(chatDoc) : null;
    } catch (error) {
      handleRepositoryError(`finding chat with user IDs: ${userIds}`, error);
    }
  }

  async findChatsByUserId(userId: string): Promise<DomainChat[]> {
    try {
      const chatDocs = await this._chatModel.find({ userIds: userId }).exec();
      return chatDocs.map(this.toDomainEntity);
    } catch (error) {
      handleRepositoryError(`finding chats for user ID: ${userId}`, error);
    }
  }

  async updateLastMessage(
    chatId: string,
    lastMessage: Message,
    session?: ISession
  ): Promise<void> {
    try {
      let clientSession;
      if (session) {
        clientSession = (
          session as unknown as { getClientSession: () => ClientSession }
        ).getClientSession();
      }

      const lastMessageData = lastMessage.toJSON();

      await this._chatModel
        .findByIdAndUpdate(
          chatId,
          { $set: { lastMessage: lastMessageData, updatedAt: new Date() } },
          { session: clientSession }
        )
        .exec();
    } catch (error) {
      handleRepositoryError(
        `updating last message for chat with ID: ${chatId}`,
        error
      );
    }
  }

  private toDomainEntity(chatDoc: ChatDocument): DomainChat {
    return new DomainChat(
      chatDoc.id,
      chatDoc.userIds,
      chatDoc.unreadMessages,
      chatDoc.updatedAt,
      chatDoc.lastMessage
    );
  }
}

export { ChatRepository };
