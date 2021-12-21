import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { Token } from '../../services/jwt';
import { validSession } from './validSession/token';

export const isAuth = (allowedRoles: [string]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * 1- check & validate session
   * 2- check & verify cookies (token)
   * 3- check & validate headers
   */

  let isValid = await validSession(req, res);
  // TODO: 1- check & validate session
  if (!isValid) {
    throw new NotAuthorizedError('Session expired signin again.');
  }

  // TODO: 2- check & verify session (token)
  let info = await Token.verifyToken(req.session.user?.token as string);

  // TODO: 3- check user privileges
  if (info && !isRoleAllowed(allowedRoles, info.role)) {
      throw new NotAuthorizedError('Not Authorized User not allowed to access.');
  }
  
  next();
};


function isRoleAllowed(allowedRoles: [string], userRole: string): boolean {
  const allowed = allowedRoles.find(e => e === userRole);
  return !!(allowed);
}