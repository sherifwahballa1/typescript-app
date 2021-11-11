import { Request } from 'express';
import keys from '../../config';
import { IUser } from '../../interfaces/IUser';

interface tempSessionInfo {
  req: Request;
  info: IUser;
}

export const ResetTempSession = (sessionInfo: tempSessionInfo): void => {
  sessionInfo.req.session.user = { user: sessionInfo.info?.userID, token: sessionInfo.req.signedCookies.t_token, role: sessionInfo.info.role };
  sessionInfo.req.session.cookie.maxAge = keys.cookie_temp_maxAge_in_Min * 60 * 1000;
  sessionInfo.req.session.cookie.expires = new Date(sessionInfo.info.exp! * 1000);
  sessionInfo.req.session.save()
};
