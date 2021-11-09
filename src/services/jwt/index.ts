import jwt from 'jsonwebtoken';
import keys from '../../config';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { IUser } from '../../interfaces/IUser';
import { tempPayload } from '../../interfaces/Jwt';
import Logger from '../../utils/Logger';


export class Token {
  /**
   * Generate temp token valid for 1 hour
   */
  static generateTempJWT(payload: tempPayload): string {
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
  static verifyTempJWT(token: string): IUser | false {
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

}