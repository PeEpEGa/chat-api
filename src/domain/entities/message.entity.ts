import { MessageStatus } from "../enums/message-status.enum";

export class Message {
  private readonly _id: string;
  private readonly _chatId: string;
  private readonly _senderId: string;
  private readonly _content: string;
  private readonly _timestamp: Date;
  //private readonly _status: MessageStatus;

  constructor(id: string, chatId: string, senderId: string, content: string) {
    this._id = id;
    this._chatId = chatId;
    this._senderId = senderId;
    this._content = content;
    this._timestamp = new Date();
    //this._status = MessageStatus.SENT;
  }

  public get messageId() {
    return this._id;
  }

  public get chatId() {
    return this._chatId;
  }

  public get senderId() {
    return this._senderId;
  }

  public get content() {
    return this._content;
  }

  public get timestamp() {
    return this._timestamp;
  }

  public toJSON() {
    return {
      id: this._id,
      chatId: this._chatId,
      senderId: this._senderId,
      content: this._content,
      timestamp: this._timestamp,
    };
  }
}
