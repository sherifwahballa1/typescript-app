import { Request, Response } from 'express';
import keys from '../../config';
import { IUser } from '../../interfaces/IUser';

export const buildTempSession = (req: Request, info: IUser): void => {
  req.session.user = { user: info?.userID, token: req.signedCookies.t_token };
  req.session.cookie.maxAge = keys.cookie_temp_maxAge_in_Min * 60 * 1000;
  req.session.cookie.expires = new Date(info.exp! * 1000);
  req.session.save()
};
