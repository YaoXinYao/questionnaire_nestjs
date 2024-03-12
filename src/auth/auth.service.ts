import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly secreKey = 'leda';
  private readonly expiresIn = 60 * 60 * 60;

  //生成token
  generateToken(payload: any): string {
    return jwt.sign(payload, this.secreKey, { expiresIn: this.expiresIn });
  }

  //验证token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secreKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
