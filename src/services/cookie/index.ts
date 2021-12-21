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
    sameSite: "none",
  })
};


export const buildCookies = (
  req: Request,
  res: Response,
  token: string
): void => {
  res.clearCookie('auth_token');
  
  res.cookie('auth_token', token, {
    httpOnly: true,
    maxAge: req.session.cookie.maxAge,
    expires: req.session.cookie.expires,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "none",
  });

  // res.cookie('isLogged', true, {
  //   httpOnly: true,
  //   maxAge: req.session.cookie.maxAge,
  //   expires: req.session.cookie.expires,
  //   secure: process.env.NODE_ENV === 'production',
  //   signed: true,
  //   sameSite: "lax",
  // })
};
