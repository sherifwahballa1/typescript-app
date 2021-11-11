import { Request } from 'express';

import keys from '../../config';
import { IUserSession } from '../../interfaces/IUser';

interface tokenPayload {
  req: Request;
  info: IUserSession;
}


export const setTokenSession = (payload: tokenPayload): void => {
  payload.req.session.user = { id: payload.info.id, user: payload.info.user, token: payload.info.token, role: payload.info.role };
  payload.req.session.cookie.maxAge = keys.cookie_token_maxAge_in_Hours * 60 * 1000; // 12 hour
  payload.req.session.save();
};