import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class StatusExceptionFilter implements ExceptionFilter {
  catch(e: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(e.getStatus()).send({
      success: false,
      message: e.getResponse()['message'],
    });
  }
}
