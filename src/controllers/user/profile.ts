import { Request, Response } from "express";
import { User } from "../../models/Users/user";
// import Email from "../../services/email";

export const Profile = async (
  req: Request,
  res: Response
) => {
  const { email, name } = req.body;

  let user = await User.findOne().byName(name);
  // console.log(user)

  return res.status(200).json(user);
};