import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { getTime } from 'src/publicMethods/userMethods';
import * as nodemailer from 'nodemailer';
import { ServiceReturnType } from 'src/type/service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  transporter: any;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {
    //创建一个NodeMailer transporter实例
    this.transporter = nodemailer.createTransport({
      host: 'smtp.qq.com', //SMTP服务器主机
      port: 465, //SMTP服务器端口
      secure: true, //使用SSL
      auth: {
        user: '3190493163@qq.com', //发送邮件
        pass: 'osubjasjjgsqddee', //授权码`
      },
    });
  }

  async addUser(user: {
    username: string;
    email: string;
  }): Promise<ServiceReturnType> {
    try {
      const res = await this.usersRepository.save({
        ...user,
        create_time: getTime(),
      });

      if (res) {
        return { code: 0, info: '注册成功' };
      } else {
        return { code: -1, info: '用户已存在，注册失败' };
      }
    } catch (error) {
      console.error('注册出错', error);
      return { code: -1, info: '注册出错' };
    }
  }

  async findAll(): Promise<ServiceReturnType> {
    try {
      const res = await this.usersRepository.find();
      if (res) {
        return { code: 0, info: res };
      } else {
        return { code: -1, info: null };
      }
    } catch (error) {
      console.error('查询出错', error);
      return { code: -1, info: null };
    }
  }

  async findUserById(id: number): Promise<ServiceReturnType> {
    try {
      const res = await this.usersRepository.findOneBy({ id });
      if (res) {
        return { code: 0, info: res };
      } else {
        return { code: -1, info: null };
      }
    } catch (error) {
      console.error('查询出错', error);
      return { code: -1, info: null };
    }
  }

  async findUserByEmail(email: string): Promise<ServiceReturnType> {
    try {
      const res = await this.usersRepository.findOneBy({ email });
      if (res) {
        return { code: 0, info: res };
      } else {
        return { code: -1, info: null };
      }
    } catch (error) {
      console.error('登录出错', error);
      return { code: -1, info: null };
    }
  }

  async login(user: LoginUserDto): Promise<ServiceReturnType> {
    try {
      const res = await this.usersRepository.findOneBy({
        email: user.email,
      });
      //生成token
      const token = this.authService.generateToken({ ...res });
      if (res) {
        return { code: 0, info: token };
      } else {
        return { code: -1, info: '登录失败' };
      }
    } catch (error) {
      console.error('登录出错', error);
      return { code: -1, info: '登录出错' };
    }
  }

  async sendCode(email: string, code: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: '3190493163@qq.com',
      to: email,
      subject: 'Verification Code', //邮箱主题
      text: `【乐答问卷】验证码：${code},五分钟内有效，如非本人操作，请忽略该邮件。`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
