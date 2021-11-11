import jwt, { Algorithm } from 'jsonwebtoken';
import keys from '../../config';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { IUser } from '../../interfaces/IUser';
import { tempPayload, tokenPayload } from '../../interfaces/Jwt';
import Logger from '../../utils/Logger';
import SessionManager from '../session/sessionManager';


export class Token {

  static sessionManager: SessionManager = new SessionManager();

  constructor() { }
  /**
   * Generate temp token valid for 1 hour
   */
  static generateTempToken(payload: tempPayload): string {
    return jwt.sign(
      payload,
      keys.temp_Token_Secret,
      {
        algorithm: `${keys.temp_Token_Algorithm}`,
        expiresIn: `${keys.cookie_temp_maxAge_in_Min}m`,
      }
    );
  }

  /**
   * Verify temp token valid for 1 hour
   */
  static verifyTempToken(token: string): IUser | false {
    try {
      return jwt.verify(
        token,
        keys.temp_Token_Secret
      ) as tempPayload;
    } catch (error: any) {
      if (error.message === 'invalid signature') Logger.error(error.message)
      if (error.message === 'jwt expired') throw new NotAuthorizedError('Session expired.');
      return false
    }
  }

  /**
  * Generate temp token valid for 1 hour
  */
  static async buildToken(payload: tokenPayload): Promise<string> {
    const session = await Token.sessionManager.login(payload.id);

    let tokenPayload = {
      ...session,
      userID: payload.userID,
      role: payload.role
    }
    return jwt.sign(tokenPayload, keys.PRIVATEKEY, {
      algorithm: keys.Token_Algorithm as Algorithm,
      expiresIn: keys.Token_Validation_Time
    });
  }

  /**
   * Verify token
   */
  static verifyToken(token: string): tokenPayload | false {
    try {
      return jwt.verify(
        token,
        keys.PUBLICKEY,
        {
          algorithms: [keys.Token_Algorithm as Algorithm]
        }
      ) as tokenPayload;
    } catch (error: any) {
      if (error.message === 'invalid signature') Logger.error(error.message)
      if (error.message === 'jwt expired') throw new NotAuthorizedError('Session expired.');
      return false
    }
  }

}