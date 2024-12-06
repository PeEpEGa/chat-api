import mongoose, { Schema } from "mongoose";

interface MessageDocument extends Document {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  _id: { type: String, required: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);

export { MessageModel, MessageDocument, MessageSchema };
