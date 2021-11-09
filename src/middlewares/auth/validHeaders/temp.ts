import { Request } from 'express';

export const validTempHeaders = (req: Request): string | false => {
  if (!req.headers || !req.headers.authorization) return false;

  if (req.headers.authorization &&
    !req.headers.authorization.startsWith("Token__")) return false;
  
  return req.headers.authorization.split(" ")[1];
};