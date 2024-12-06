import { MessageDTO } from "../message-dtos/message.dto";

export type ChatDTO = {
  id: string;
  userIds: [string, string];
  lastMessage?: MessageDTO;
  unreadMessages: number;
  updatedAt?: Date;
};
