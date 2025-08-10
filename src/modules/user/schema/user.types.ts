import { Types } from "mongoose";

export interface UserResponse {
  _id: Types.ObjectId | string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: Types.ObjectId | string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
}
