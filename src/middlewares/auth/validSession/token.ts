import { Request, Response } from 'express';
import { Schema } from "mongoose";

import { buildCookies } from '../../../services/cookie';
import { Token } from '../../../services/jwt';

export const validSession = async (req: Request, res: Response): Promise<boolean> => {
  if (!req.session || !req.session.user) return false;

  if (req.session && req.session.user) {
    console.log(Date.parse(`${req.session.cookie.expires}`) < Date.now());

    if (Date.parse(`${req.session.cookie.expires}`) < Date.now()) return false;
    if (!req.session.user.role || !req.session.user.id || !req.session.user.user) return false;
    // build token
    let token = await Token.buildToken({ id: req.session.user.id as string, role: req.session.user.role, userID: req.session.user.user });
    req.session.user.token = token;
    req.session.touch();
    req.session.save();
    // buildCookies(req, res, token);
    return true;
  }

  return false;
};