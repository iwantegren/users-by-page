import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class StatusExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(StatusExceptionFilter.name);

  catch(e: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.debug(`Error ${e.getStatus()}: ${e.getResponse()['message']}`);

    response.status(e.getStatus()).send({
      success: false,
      message: e.getResponse()['message'],
    });
  }
}
