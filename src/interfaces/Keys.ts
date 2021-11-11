import { Algorithm } from "jsonwebtoken";

export interface Keys {
  port: number;
  ORIGIN_CORS: string;
  SESSION_SECRET: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  MONGODB_URI: string;
  MONGODB_URI_WINTSON: string;
  ticketValidationInDays: number;
  timeBetweenPasswordResetsInHours: number;
  banDurationInHours: number;
  maxTicketUsagePerHour: number;
  WS_PORT: number;
  temp_Token_Duration_In_Hours: number;
  temp_Token_Secret: string;
  temp_Token_Algorithm: Algorithm;
  cookie_maxAge_in_Min: number;
  cookie_token_maxAge_in_Hours: number;
  cookie_temp_maxAge_in_Min: number;
  User_Email: string;
  User_Password: string;
  SMTP_SERVICE: string;
  REFRESH_TOKEN: string;
  CLIENT_SECRET: string;
  CLIENT_ID: string;
  Token_Algorithm: string;
  maxLogins: number;
  Token_Validation_Time: Algorithm;
  PRIVATEKEY: any;
  PUBLICKEY: any;
}