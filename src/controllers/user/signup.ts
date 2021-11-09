import { Request, Response } from "express";
import keys from "../../config";
import { User } from "../../models/Users/user";
import { buildTempCookies } from "../../services/cookie";
import { Token } from "../../services/jwt"

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
  let token = Token.generateTempJWT({ email: email, userID: user.userID });

  if (req.session) {
    req.session.user = { user: user.userID, token };
    req.session.cookie.maxAge = keys.cookie_temp_maxAge_in_Min * 60 * 1000; // 1 hour
    req.session.save();
  }

  buildTempCookies(req, res, token);

  return res.status(200).send({ user, token });
};