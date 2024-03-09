import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  NOTVARIFYPATH = ['/user/login', '/user/addUser', '/user/sendCode'];
  use(req: any, res: any, next: (error?: any) => void) {
    const path = req.originalUrl.split('?')[0];
    if (this.NOTVARIFYPATH.indexOf(path) >= 0) {
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, 'leda');
        req.user = decoded;
        next();
      } catch (error) {
        res
          .status(401)
          .json({ code: 401, info: '无效Token', msg: '无效Token' });
      }
    } else {
      res
        .status(401)
        .json({ code: 401, info: '未获取到token', msg: '未获取到token' });
    }
  }
}
