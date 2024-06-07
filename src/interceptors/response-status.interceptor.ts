import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class StatusResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    console.log('intercept');
    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        console.log(
          `Response... Status: ${response.statusCode}, Time: ${Date.now() - now}ms, Data: ${JSON.stringify(data)}`,
        );
      }),
      catchError((err) => {
        console.log(
          `Error... Status: ${err.status || 500}, Time: ${Date.now() - now}ms, Error: ${JSON.stringify(err.message)}`,
        );
        return throwError(err);
      }),
    );
  }
}
