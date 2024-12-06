import { IChatRepository } from "../../../persistance/interfaces/chat-repository.interface";
import { RepositoryManager } from "../../../persistance/repositories/repository";
import { ChatModel } from "../../../persistance/models/chat.model";
import { ChatController } from "../../controllers/chat.controller";
import { TokenService } from "../../../application/services/token-service";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-cases/create-chat.use-case";
import { IUserRepository } from "../../../persistance/interfaces/user-repository.interface";
import { UserModel } from "../../../persistance/models/user.model";
import { UuidV7Generator } from "../../../application/services/uuidv7-generator";
import { GetChatByIdUseCase } from "../../../application/use-cases/chat-use-cases/get-chat-by-id.use-case";
import { GetChatsByUserIdUseCase } from "../../../application/use-cases/chat-use-cases/get-chats-by-user-id.use-case";
import { DeleteChatUseCase } from "../../../application/use-cases/chat-use-cases/delete-chat.use-case";
import { MessageModel } from "../../../persistance/models/message.model";
import { MongooseSessionFactory } from "../../../persistance/mongoose-session";
import { IMessageRepository } from "../../../persistance/interfaces/message-repository.interface";

export function setChatRouteDependencies(
  mockChatRepository?: IChatRepository,
  mockkUserRepository?: IUserRepository,
  mockMessageRepository?: IMessageRepository
) {
  const chatRepository =
    mockChatRepository || RepositoryManager.getChatRepository(ChatModel);

  const userRepository =
    mockkUserRepository || RepositoryManager.getUserRepository(UserModel);

  const messageRepository =
    mockMessageRepository ||
    RepositoryManager.getMessageRepository(MessageModel);

  const tokenService = new TokenService();
  const idService = new UuidV7Generator();
  const sessionFactory = new MongooseSessionFactory();

  const createChatUseCase = new CreateChatUseCase(
    chatRepository,
    userRepository,
    idService
  );
  const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository);
  const getChatsByUserIdUseCase = new GetChatsByUserIdUseCase(chatRepository);
  const deleteChatUseCase = new DeleteChatUseCase(
    chatRepository,
    messageRepository,
    sessionFactory
  );

  const chatController = new ChatController(
    createChatUseCase,
    deleteChatUseCase,
    getChatByIdUseCase,
    getChatsByUserIdUseCase
  );

  return { chatController, tokenService };
}
