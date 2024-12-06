import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import {
  ISession,
  ISessionFactory,
} from "../../../persistance/interfaces/session.interface";
import { BaseUseCase } from "../base.use-case";

export class DeleteChatUseCase extends BaseUseCase<string, void> {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _sessionFactory: ISessionFactory
  ) {
    super();
  }

  async execute(id: string): Promise<void> {
    let session: ISession | undefined;
    try {
      const chat = await this._chatRepository.findById(id);
      if (!chat) {
        throw new Error("Failed to delete chat: Chat not found");
      }

      session = await this._sessionFactory.startSession();
      await session.startTransaction();

      await this._messageRepository.deleteAllMessages(id, session);

      await this._chatRepository.delete(id, session);

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      this.handleError(error, "Failed to delete chat");
      throw new Error("Failed to delete chat");
    }
  }
}
