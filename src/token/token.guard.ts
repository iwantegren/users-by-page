import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly service: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.switchToHttp().getRequest().headers['token'];
    if (!token) {
      return false;
    }

    return this.service.invalidate(token).then((isValid) => {
      if (!isValid)
        return Promise.reject(new UnauthorizedException('The token expired.'));
      return true;
    });
  }
}
