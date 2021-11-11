import { Request } from 'express';
import keys from '../../config';
import { IUserSession } from '../../interfaces/IUser';

interface tempPayload {
  req: Request;
  info: IUserSession;
}

export const setTempSession = (payload: tempPayload): void => {
  payload.req.session.user = { user: payload.info.user, token: payload.info.token, role: payload.info.role };
  payload.req.session.cookie.maxAge = keys.cookie_temp_maxAge_in_Min * 60 * 1000; // 1 hour
  payload.req.session.save();
};



