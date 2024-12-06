import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { BaseUseCase } from "../base.use-case";

export class DeleteMessageUseCase extends BaseUseCase<string, void> {
  constructor(private readonly _messageRepository: IMessageRepository) {
    super();
  }

  async execute(id: string): Promise<void> {
    try {
      const message = await this._messageRepository.findById(id);
      if (!message) {
        throw new Error("Failed to delete message: Message not found");
      }

      await this._messageRepository.delete(id);
    } catch (error) {
      this.handleError(error, "Failed to delete message");
      throw new Error("Failed to delete message");
    }
  }
}
