import { Document, Model } from "mongoose";

export interface UserCredentials {
  name?: string;
  email: string;
  password: string;
};

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  country: string;
};

export interface UserDoc extends Document {
  name: string;
  email: string;
  userID: string;
  password: string;
  score: number;
  country: string;
  isVerified: boolean;
  role: string;
  active: boolean;
  otp: string;
  otpRequestCounter: number;
  otpNextResendAt: Date;
  otpSubmitCounter: number; // number of submitted OTP in a short time
  otpNextSubmitAt: Date;
  forgotPasswordResetCounter: number;
  forgotPasswordNextResetAt: Date;
  scoreUpdateAt: Date;
  challengesHints: [string];

  updateOtp(): void;
  updateSubmitOtp(): void;
  setUserVerify(): void;
};


export interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByCredentials(credentials: UserCredentials): Promise<UserDoc | null>;
  byName(name: string): Promise<UserDoc | null>;
  byEmail(email: string): Promise<UserDoc | null>;
  byUUID(UUID: string): Promise<UserDoc | null>;
  byUserID(id: string): Promise<UserDoc | null>;
}