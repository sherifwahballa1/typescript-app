import { Request, Response, NextFunction } from "express";

type IHandler = (req: Request, res: Response, next?: NextFunction) => void;

/**
 * Takes express middleware and operates try-catch block.
 * With using this, we no longer need to add try-catch block each time
 * @param handler express middleware
 */
const tryCatchWrapper = (handler: IHandler) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
};

export default tryCatchWrapper;
