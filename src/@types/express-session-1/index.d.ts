import session from "express-session-types";
import { IUserSession } from "../../interfaces/IUser";

declare module 'express-session' {
  interface SessionData {
     user: IUserSession;
  }
}