declare namespace Express {
	interface Request {
		user?: import("../../interfaces/IUser").IUser;
	}
}
