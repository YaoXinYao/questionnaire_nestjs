import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  NOTVARIFYPATH = ['/user/login', '/user/addUser', '/user/sendCode'];
  async use(req: any, res: any, next: (error?: any) => void) {
    const path = req.originalUrl.split('?')[0];
    if (this.NOTVARIFYPATH.indexOf(path) >= 0) {
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = await this.authService.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        console.log(error);

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
