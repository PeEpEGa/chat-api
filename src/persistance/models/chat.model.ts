import mongoose, { Schema, Document } from "mongoose";
import { Message } from "../../domain/entities/message.entity";

interface ChatDocument extends Document {
  _id: string;
  userIds: [string, string];
  lastMessage?: Message;
  unreadMessages: number;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    userIds: {
      type: [String],
      required: true,
      validate: {
        validator: function (value: string[]) {
          return value.length === 2;
        },
        message: "A chat must have exactly two user IDs.",
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.Mixed,
    },
    unreadMessages: {
      type: Number,
      required: true,
      default: 0,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<ChatDocument>("Chat", ChatSchema);

export { ChatModel, ChatDocument };
