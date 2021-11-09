import { Request, Response, NextFunction } from 'express';

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-Token', req.csrfToken());
  res.locals.csrfToken = req.csrfToken(); //extract as req.csrfToken()
  next();
}