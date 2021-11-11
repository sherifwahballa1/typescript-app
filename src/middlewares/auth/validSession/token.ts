import { Request, Response } from 'express';
import { Schema } from "mongoose";

import { buildCookies } from '../../../services/cookie';
import { Token } from '../../../services/jwt';

export const validSession = async (req: Request, res: Response): Promise<boolean> => {
  if (!req.session || !req.session.user) return false;

  if (req.session && req.session.user) {
    if (Date.parse(`${req.session.cookie.expires}`) < Date.now()) return false;
    req.session.touch();
    // build token
    let token = await Token.buildToken({ id: req.session.user.id as Schema.Types.ObjectId, role: req.session.user.role, userID: req.session.user.user });
    buildCookies(req, res, token);
    return true;
  }

  return false;
};