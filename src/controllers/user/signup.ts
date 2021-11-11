import { Request, Response } from "express";

import { User } from "../../models/Users/user";
import { buildTempCookies } from "../../services/cookie";
import { Token } from "../../services/jwt"
import { setTempSession } from "../../services/session/set-temp-session";

export const SignUp = async (
  req: Request,
  res: Response
) => {
  const { name, email, password, country } = req.body;

  let existingUser = await User.findOne({
    $or: [
      { email },
      { name }
    ]
  });


  if (existingUser && existingUser.name === name)
    return res.status(200).json({ valid: false, msg: "Name has already been taken.", taken: true })

  if (existingUser)
    return res
      .status(200)
      .json({ valid: false, msg: "Email has already been taken.", taken: true })

  const user = User.build({ name, email, password, country });
  await user.save();

  // generate temp token valid for 1 hour.
  let token = Token.generateTempToken({ email: email, userID: user.userID, role: user.role });

  // build cookies & session
  if (req.session) setTempSession({ req, info: { user: user.userID, token, role: user.role } })
  buildTempCookies(req, res, token);

  return res.status(200).send({ user, token });
};