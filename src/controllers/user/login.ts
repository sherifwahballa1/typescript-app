import { Request, Response } from "express";
import { Schema } from "mongoose";
import crypto from 'crypto';

import { User } from "../../models/Users/user";
import { buildTempCookies } from "../../services/cookie";
import { Token } from "../../services/jwt"
import { buildCookies } from "../../services/cookie";
import { setTokenSession } from "../../services/session/set-token-session";
import { setTempSession } from "../../services/session/set-temp-session";

export const Login = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  let user = await User.findByCredentials({ email, password });

  if (user && !user.isVerified) {
    // generate temp token valid for 1 hour.
    let token = Token.generateTempToken({ email: email, userID: user?.userID, role: user?.role });
    // build cookies & session
    if (req.session) setTempSession({ req, info: { user: user.userID, token, role: user.role } })
    buildTempCookies(req, res, token);
    return res.status(201).json({
      temp: token,
      verified: false,
      message: "Email  not verified please check email address",
    });
  }

  // build token
  let token = await Token.buildToken({ id: user?.id, role: user?.role as string, userID: user?.userID as string });

  // build session & cookies & remove tmep_token
  if (req.session) setTokenSession({ req, info: { user: user?.userID as string, id: user?.id, role: user?.role as string, token: crypto.randomBytes(16).toString('base64') } });
  buildCookies(req, res, token);
  res.clearCookie("t_auth");

  return res.status(200).send({ user, token });
};