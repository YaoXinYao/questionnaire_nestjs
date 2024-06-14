import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './dto/add-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import * as randomstring from 'randomstring';
import * as NodeCache from 'node-cache';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

//全局缓存实例
const cache = new NodeCache();

@ApiTags('user')
@ApiBearerAuth() //token鉴权
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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
      cache.del(email);
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
    code = code.toUpperCase();
    if (myCode != code || !code) {
      return { code: -1, info: '登录失败，验证码错误' };
    }
    cache.del(email);
    return this.userService.login(loginUserDto);
  }

  //发送验证码
  @Get('sendCode')
  async sendCode(@Query('email') email: string) {
    let code: string = randomstring.generate(6);
    cache.set(email, code.toUpperCase(), 300); //五分钟有效
    await this.userService.sendCode(email, code);
    return { code: 0, info: '发送成功' };
  }

  @Patch('updateUserInfo')
  @ApiBody({
    type: UpdateUserDto,
  })
  async updateUserInfo(@Body() requestBody: { id: number; username: string }) {
    const { id, username } = requestBody;
    return this.userService.updateUserInfoService(id, username);
  }

  //退出登陆
  @Post('logout')
  async logout(@Headers() headers) {
    try {
      const token = headers.authorization.split(' ')[1];
      this.authService.addBlackList(token);
      return { code: 0, info: '退出成功' };
    } catch (error) {
      return { code: -1, info: '退出失败' };
    }
  }
}
