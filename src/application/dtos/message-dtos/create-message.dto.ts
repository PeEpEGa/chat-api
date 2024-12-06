export type CreateMessageDTO = {
  chatId: string;
  senderId: string;
  content: string;
  isAutoResponse?: boolean;
};
