import { Request, Response } from "express";
import { Schema } from "mongoose";
import crypto from 'crypto';

import { User } from "../../models/Users/user";
import { Token } from "../../services/jwt"
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { BadRequestError } from "../../errors/bad-request-error";
import Logger from "../../utils/Logger";
import { setTokenSession } from "../../services/session/set-token-session";
import { buildCookies } from "../../services/cookie";


export const VerifyOtp = async (
  req: Request,
  res: Response
) => {

  const { otp } = req.body;

  const user = await User.findOne().byUUID(req.user?.userID as string);
  if (!user) throw new NotAuthorizedError();

  if (user.isVerified)
    return res.status(200).send({ message: "User already verified.", verified: true });

  // if otp next submit time didn't expire
  let otpNextSubmitAtInMilliseconds = new Date(user.otpNextSubmitAt).getTime();

  if (otpNextSubmitAtInMilliseconds > Date.now()) {
    let timeNextSubmitOpt = Math.round((otpNextSubmitAtInMilliseconds - Date.now()) / (1000 * 60));
    Logger.error(`Number of your tries is finished try again later after ${timeNextSubmitOpt + 1} minute(s)`);
    throw new BadRequestError(`Number of your tries is finished try again later after ${timeNextSubmitOpt + 1} minute(s)`);
  }

  if (user.otp !== otp) {
    user.updateSubmitOtp();
    await user.save();
    throw new BadRequestError("Invalid code");
  }

  // verify user
  user.setUserVerify();
  await user.save();

  // build token
  let token = await Token.buildToken({ id: user.id as Schema.Types.ObjectId, role: user.role, userID: user.userID });
  // build session & cookies
  if (req.session) setTokenSession({ req, info: { user: user.userID, id: user.id as Schema.Types.ObjectId, role: user.role, token: crypto.randomBytes(16).toString('base64') } });
  buildCookies(req, res, token);

  return res.status(200).send({ user, token });
};