import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly secreKey = 'leda';

  //生成token
  generateToken(payload: any): string {
    return jwt.sign(payload, this.secreKey);
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
