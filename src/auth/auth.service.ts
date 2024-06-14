import { Injectable, Scope } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
// import NodeCache from 'node-cache';
import * as NodeCache from 'node-cache';

const cache = new NodeCache();
let a = '我是a';
@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  private readonly secreKey = 'leda';
  private readonly expiresIn = 24 * 60 * 60;
  constructor() {}

  //生成token并存储到缓存中
  generateToken(payload: any): string {
    let token = jwt.sign(payload, this.secreKey, { expiresIn: this.expiresIn });
    return token;
  }

  //验证token
  verifyToken(token: string): any {
    try {
      if (cache.has(token)) {
        throw new Error('Invalid token');
      }
      return jwt.verify(token, this.secreKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  //退出登陆
  addBlackList(token: string): any {
    try {
      cache.set(token, '黑名单', this.expiresIn);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
