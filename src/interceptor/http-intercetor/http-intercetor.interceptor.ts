import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Response<T> {
  info: T;
  code: number;
  msg: string;
}

@Injectable()
export class HttpInterceptorInterceptor<T>
  implements
    NestInterceptor<{ info: T; code: number; msg: string }, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<{ info: T; code: number; msg: string }>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          info: data.info,
          code: data.code,
          msg: '请求成功',
        };
      }),
    );
  }
}