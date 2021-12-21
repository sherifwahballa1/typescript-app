export interface tempPayload {
  userID: string;
  email: string;
  role: string;
}


export interface tokenPayload {
  userID: string;
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}