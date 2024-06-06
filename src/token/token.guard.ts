import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from './token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly service: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.switchToHttp().getRequest().headers['token'];
    if (token) {
      return this.service.invalidate(token).then();
    }
    return false;
  }
}
