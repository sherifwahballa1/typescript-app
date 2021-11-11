import { Schema } from "mongoose";

export interface tempPayload {
  userID: string;
  email: string;
  role: string;
}


export interface tokenPayload {
  userID: string;
  id: Schema.Types.ObjectId;
  role: string;
  iat?: number;
  exp?: number;
}