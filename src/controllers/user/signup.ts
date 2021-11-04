import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user";

export const SignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    let existingUser = await User.findOne({ email }).cache({ key: 'ADF', expire: 400 })

    if (existingUser) return res.status(400).send({ message: 'Email in use' });

    const user = User.build({ email, password });
    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    next(error)
  }
};