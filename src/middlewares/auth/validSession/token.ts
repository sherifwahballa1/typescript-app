// import { Request, Response } from 'express';
// import { buildTempCookies } from '../../../services/cookie';
// import { Token } from '../../../services/jwt';

// export const validTempSession = (req: Request, res: Response): boolean => {
//   if (req.session && req.session.user) {
//     if (Date.parse(`${req.session.cookie.expires}`) < Date.now()) return false;
//     req.session.touch();
//     buildTempCookies(req, res, req.session.user?.token as string);
//     return true;
//   }

//   if (req.signedCookies && req.signedCookies.t_token) {
//     let info = Token.verifyTempJWT(req.signedCookies.t_token);
//     if (info) {
//       req.session.user = { user: info?.userID, token: req.signedCookies.t_token };
//       req.session.save();
//       return true;
//     }
//   }

//   return false;
// };