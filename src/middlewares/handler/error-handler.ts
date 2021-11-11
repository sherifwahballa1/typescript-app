import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../errors/custom-error';
import Logger from '../../utils/Logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  Logger.error(err.message);
  res.status(500).send({
    errors: [{ message: 'Internal Server Error Something went wrong', err: err.message }]
  });
};
