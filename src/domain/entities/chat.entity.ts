import { Message } from "./message.entity";

export class Chat {
  private readonly _id: string;
  private readonly _userIds: [string, string];
  private readonly _lastMessage?: Message;
  private readonly _unreadMessages: number;
  private readonly _updatedAt?: Date;

  constructor(
    id: string,
    userIds: [string, string],
    unreadMessages: number,
    updatedAt?: Date,
    lastMessage?: Message
  ) {
    this._id = id;
    this._userIds = userIds;
    this._unreadMessages = unreadMessages;
    this._lastMessage = lastMessage;
    this._updatedAt = updatedAt;
  }

  public get chatId() {
    return this._id;
  }

  public get userIds() {
    return this._userIds;
  }

  public get lastMessage() {
    return this._lastMessage;
  }

  public get unreadMessages() {
    return this._unreadMessages;
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  public getAnotherUserId(currentUserId: string) {
    return this._userIds[0] === currentUserId
      ? this._userIds[1]
      : this._userIds[0];
  }

  public toJSON() {
    return {
      id: this._id,
      userIds: this._userIds,
      lastMessage: this._lastMessage,
      unreadMessages: this._unreadMessages,
      updatedAt: this._updatedAt,
    };
  }
}
