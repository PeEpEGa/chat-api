import { GetMessageByIdUseCase } from "../../../application/use-cases/message-use-cases/get-message-by-id.use-case";
import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";
import { RepositoryManager } from "../../../persistance/repositories/repository";
import { MessageController } from "../../controllers/message.controller";
import { MessageModel } from "../../../persistance/models/message.model";
import { CreateMessageUseCase } from "../../../application/use-cases/message-use-cases/create-message.use-case";
import { UserModel } from "../../../persistance/models/user.model";
import { ChatModel } from "../../../persistance/models/chat.model";
import { UuidV7Generator } from "../../../application/services/uuidv7-generator";
import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { DeleteMessageUseCase } from "../../../application/use-cases/message-use-cases/delete-message.use-case";
import { GetAllMessagesByChatUseCase } from "../../../application/use-cases/message-use-cases/get-all-messages-by-chat.use-case";
import { GetAllMessagesByChatPaginatedUseCase } from "../../../application/use-cases/message-use-cases/get-all-messages-by-chat-paginated.use-case";
import { TokenService } from "../../../application/services/token-service";
import { MongooseSessionFactory } from "../../../persistance/mongoose-session";
import { AutoResponseUseCase } from "../../../application/use-cases/message-use-cases/auto-response.use-case";
import { QuoteService } from "../../../application/services/quote-service";
import { setupMessageCreatedListener } from "../../../application/events/listeners/message-created.listener";

export function setMessagesRouteDependencies(
  mockMessageRepository?: IMessageRepository,
  mockChatRepository?: IChatRepository,
  mockkUserRepository?: IUserRepository
) {
  const messageRepository =
    mockMessageRepository ||
    RepositoryManager.getMessageRepository(MessageModel);
  const userRepository =
    mockkUserRepository || RepositoryManager.getUserRepository(UserModel);
  const chatRepository =
    mockChatRepository || RepositoryManager.getChatRepository(ChatModel);

  const idGeneratorService = new UuidV7Generator();
  const tokenService = new TokenService();
  const sessionFactory = new MongooseSessionFactory();
  const quoteService = new QuoteService();

  const createMessageUseCase = new CreateMessageUseCase(
    messageRepository,
    chatRepository,
    userRepository,
    idGeneratorService,
    sessionFactory
  );
  const autoResponseUseCase = new AutoResponseUseCase(
    createMessageUseCase,
    chatRepository,
    quoteService
  );

  setupMessageCreatedListener(autoResponseUseCase);

  const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);
  const getUserUseCase = new GetMessageByIdUseCase(messageRepository);
  const getAllMessagesByChatUseCase = new GetAllMessagesByChatUseCase(
    messageRepository
  );
  const getAllMessagesByChatPaginatedUseCase =
    new GetAllMessagesByChatPaginatedUseCase(messageRepository);

  const messagesController = new MessageController(
    createMessageUseCase,
    deleteMessageUseCase,
    getUserUseCase,
    getAllMessagesByChatUseCase,
    getAllMessagesByChatPaginatedUseCase
  );

  return { messagesController, tokenService };
}
