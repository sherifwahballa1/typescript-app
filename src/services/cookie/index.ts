import { Request, Response } from 'express';

export const buildTempCookies = (
  req: Request,
  res: Response,
  token: string
): void => {
  res.cookie('t_auth', token, {
    httpOnly: true,
    maxAge: req.session.cookie.maxAge,
    expires: req.session.cookie.expires,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    // sameSite: true,
  })
};
