import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpInterceptorInterceptor } from './interceptor/http-intercetor/http-intercetor.interceptor';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { AnswerModule } from './answer/answer.module';
import { AuthMiddleware } from './auth/AuthMiddleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123123',
      database: 'questionnaire',
      // entities:['dist/**/*.entity{.ts,.js}'],
      entities: [User],
      synchronize: true,
      //自动加载实体
      autoLoadEntities: true,
    }),
    UserModule,
    QuestionnaireModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptorInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    throw new Error('Method not implemented.');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
