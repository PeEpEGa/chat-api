import { CreateMessageDTO } from "../../dtos/message-dtos/create-message.dto";
import { AutoResponseUseCase } from "../../use-cases/message-use-cases/auto-response.use-case";
import { messageEvents } from "../message-events";

export function setupMessageCreatedListener(
    autoResponseUseCase: AutoResponseUseCase
  ): void {
    messageEvents.on("messageCreated", async (messageData: CreateMessageDTO) => {
      try {
        const isAutoResponseRequired = !messageData.isAutoResponse;
        if (isAutoResponseRequired) {
          await autoResponseUseCase.execute(messageData);
        }
      } catch (error) {
        console.error("Failed to generate auto-response:", error);
      }
    });
  }
