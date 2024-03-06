import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './dto/add-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as randomstring from 'randomstring';
import * as NodeCache from 'node-cache';
import * as jwt from 'jsonwebtoken';

//全局缓存实例
const cache = new NodeCache();

@ApiTags('user')
@ApiBearerAuth() //token鉴权
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('code')
  async code(@Query('email') email: string) {
    let code = cache.get(email);
    return { code: 0, info: code };
  }

  @Post('addUser')
  async addUser(@Body() addUserDto: AddUserDto) {
    let { code, email, username } = addUserDto;
    let myCode = cache.get(email);
    if (code != myCode) {
      return { code: -1, info: '注册失败，验证码错误' };
    }
    let isExist = await this.userService.findUserByEmail(email);
    if (isExist.code == 0) {
      return { code: -1, info: '注册失败，该邮箱已存在' };
    } else {
      return { code: 0, info: this.userService.addUser({ email, username }) };
    }
  }

  @Get('findAll')
  findAll() {
    this.userService.findAll();
  }

  @Get('findUserById')
  findUserById(@Query('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Get('findUserByEmail')
  findUserByEmail(@Query('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Get('getLoginUser')
  getLoginUser(@Headers() headers) {
    const token = headers.authorization.split(' ')[1];
    const info = jwt.verify(token, 'leda');
    return { code: 0, info: info };
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    let { code, email = '' } = loginUserDto;
    let myCode = cache.get(email);

    if (myCode != code || !code) {
      return { code: -1, info: '登录失败，验证码错误' };
    }

    return this.userService.login(loginUserDto);
  }

  //发送验证码
  @Get('sendCode')
  async sendCode(@Query('email') email: string) {
    let code: string = randomstring.generate(6);
    cache.set(email, code, 300); //五分钟有效
    await this.userService.sendCode(email, code);
    return '发送成功';
  }
}
