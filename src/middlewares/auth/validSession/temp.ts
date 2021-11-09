import { Request, Response } from 'express';
import { buildTempCookies } from '../../../services/cookie';
import { Token } from '../../../services/jwt';
import { buildTempSession } from '../../../services/session/build-temp-session';

export const validTempSession = (req: Request, res: Response): boolean => {
  if (req.session && req.session.user) {
    if (Date.parse(`${req.session.cookie.expires}`) < Date.now()) return false;
    buildTempCookies(req, res, req.session.user?.token as string);
    return true;
  }

  if (req.signedCookies && req.signedCookies.t_auth) {
    let info = Token.verifyTempJWT(req.signedCookies.t_auth);
    if (info) {
      buildTempSession(req, info)
      return true;
    }
  }

  return false;
};