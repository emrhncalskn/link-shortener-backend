import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name:  { type: String, required: true }
}, { timestamps: true });

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>("User", userSchema);
