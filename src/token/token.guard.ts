import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  private readonly logger = new Logger(TokenGuard.name);

  constructor(private readonly service: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection.remoteAddress;
    const token = req.headers['token'];
    if (!token) {
      this.logger.debug(`No token provided by ${ip}`);
      return false;
    }

    return this.service.invalidate(token).then((isValid) => {
      if (!isValid) {
        this.logger.debug(`Invalid token provided by ${ip}`);
        return Promise.reject(new UnauthorizedException('The token expired.'));
      }

      this.logger.debug(`Token valid for ${ip}`);
      return true;
    });
  }
}
