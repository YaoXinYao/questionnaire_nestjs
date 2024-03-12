import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception/http-exception.filter';
import { HttpInterceptorInterceptor } from './interceptor/http-intercetor/http-intercetor.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //1.创建swagger选项
  const options = new DocumentBuilder()
    .setTitle('Questionnaire API')
    .setDescription('The example API description')
    .setVersion('1.0')
    .addTag('questionnaire')
    .addBearerAuth()
    .build();

  //2.创建swagger文档
  const document = SwaggerModule.createDocument(app, options);

  //3.设置'/api'路由为swagger文档及其UI主页
  SwaggerModule.setup('api', app, document);

  await app.listen(9000);
  //请求失败过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  //请求成功拦截器。用于整个应用，用于每个控制器和每个路由处理程序
  app.useGlobalInterceptors(new HttpInterceptorInterceptor());
}
bootstrap();
