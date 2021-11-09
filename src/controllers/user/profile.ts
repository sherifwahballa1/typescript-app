import { NextFunction, Request, Response } from "express";
import { User } from "../../models/Users/user";
import Email from "../../services/email";

export const Profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne().byName(name);

    // await new Email({ name: 'ahmed', email: 'kero@mailsac.com', code: '134563' }).sendWelcome();

    return res.status(200).json(user);
  } catch (error) {
    next(error)
  }
};