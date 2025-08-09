import { InferSchemaType, Types } from "mongoose";
import { userSchema } from "./user.model";

export type User = InferSchemaType<typeof userSchema>;

export interface UserResponse {
  _id: Types.ObjectId | string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
}
