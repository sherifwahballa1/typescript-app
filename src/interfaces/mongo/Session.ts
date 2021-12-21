import { Document, Model } from "mongoose";
import { NewLogin } from "../ISession";

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  country: string;
};

interface SessionExp {
  urn: number;
  iat: number;
  exp: number;
}

interface SessionUsage {
  total: number,
  span: Date,
  blocked: boolean,
  nextAt: Date
}

export interface SessionDoc extends Document {
  user: string;
  role: string;
  sessions: [SessionExp];
  usage: SessionUsage,
  updateAt: Date;
};


export interface SessionModel extends Model<SessionDoc> {
  initSession(): void;
  newLogin(): NewLogin;
  // newLogin(): any;
  // build(attrs: UserAttrs): UserDoc;
  // updateSubmitOtp(): void;
  // setUserVerify(): void;
}