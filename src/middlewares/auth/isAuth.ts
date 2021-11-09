// import { Request, Response, NextFunction } from 'express';
// import { NotAuthorizedError } from '../../errors/not-authorized-error';
// import { validSession } from './validSession/token';

// export const isAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   /**
//    * 1- check & validate session
//    * 2- check & validate cookies
//    * 3- check & validate headers
//    */
  
//   // TODO: 1- check & validate session
//   if (!validSession(req, res)) {
//     throw new NotAuthorizedError('Session expired signin again');
//   }

//   console.log(req.session.cookie.expires);
//   next();
// };
