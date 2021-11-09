export interface IUser {
	email: string;
	userID: string;
	iat?: number;
	exp?: number;
}

export interface IUserSession {
	user: string;
	token: string;
}
