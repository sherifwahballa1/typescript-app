import * as uuid from 'uuid';
import { Request, Response } from "express";

import { User } from "../../models/Users/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import Email from "../../services/email";
import Logger from '../../utils/Logger';

export const SendOtp = async (
  req: Request,
  res: Response
) => {
  if (!uuid.validate(req.user?.userID as string))
    throw new BadRequestError('Invalid Credentials');

  const user = await User.findOne().byUUID(req.user?.userID as string);
  if (!user) throw new NotAuthorizedError();

  let otpNextResendAtInMilliseconds = new Date(user.otpNextResendAt).getTime();

  // if otp next resend time didn't expire
  if (otpNextResendAtInMilliseconds > Date.now()) {
    let timeNextOpt = Math.trunc((otpNextResendAtInMilliseconds - Date.now()) / (1000 * 60));
    Logger.error(`Try again later after ${timeNextOpt + 1} minute(s)`);
    throw new BadRequestError(`Try again later after ${timeNextOpt + 1} minute(s)`);
  }

  user.updateOtp();
  await user.save();

  await new Email({ name: user.name, email: user.email, code: user.code }).sendWelcome();

  return res.status(200).send({ message: "Please Check your Email", email: user.email });
};