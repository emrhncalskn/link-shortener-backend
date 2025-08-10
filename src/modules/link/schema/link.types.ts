import { Types } from "mongoose";

export interface Link {
  _id: Types.ObjectId | string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  userId?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkResponse {
  _id: Types.ObjectId | string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLinkInput {
  originalUrl: string;
  customCode?: string;
}

export interface LinkClick {
  _id: Types.ObjectId | string;
  linkId: Types.ObjectId | string;
  ipAddress?: string;
  userAgent?: string;
  clickedAt: Date;
}
