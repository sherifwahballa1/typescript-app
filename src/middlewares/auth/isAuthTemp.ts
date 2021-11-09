import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../errors/forbidden-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { Token } from '../../services/jwt';
import { validTempHeaders } from './validHeaders/temp';
import { validTempSession } from './validSession/temp';

export const isAuthTemp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * 1- check & validate session && cookies
   * 2- check & validate headers
   * 3- check if tokens equel each other
   * 4- verify token
   */

  // TODO: 1- check & validate session || signed_cookies
  if (!validTempSession(req, res)) {
    // if session & cookies not existing
    throw new ForbiddenError('Execute access forbidden.');
  }


  // TODO: 2- check & validate headers
  if (!validTempHeaders(req)) {
    throw new ForbiddenError();
  }

  // TODO: 3- check if tokens equel each other
  if (req.session.user?.token !== req.signedCookies.t_auth || req.session.user?.token !== validTempHeaders(req)) {
    throw new NotAuthorizedError('Not authorized something goes wrong signin again.');
  }

  // TODO: 4- verify token and return data
  let userInfo = Token.verifyTempJWT(req.session.user?.token);

  if (!userInfo) throw new NotAuthorizedError();
  req.user = userInfo;

  next();
};
