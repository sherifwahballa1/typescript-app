export interface IUser {
	email: string;
	userID: string;
	role: string;
	iat?: number;
	exp?: number;
}

export interface IUserSession {
	token: string;
	user: string;
	role: string;
	id?: string;
}

