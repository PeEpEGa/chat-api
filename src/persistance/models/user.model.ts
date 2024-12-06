import mongoose, { Schema, Document } from "mongoose";

interface UserDocument extends Document {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export { UserModel, UserDocument };
