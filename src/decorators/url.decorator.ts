import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const protocol = request.headers['x-forwarded-proto'] || request.protocol;
    return `${protocol}://${request.get('host')}${request.baseUrl}${request.path}`;
  },
);

export const HostUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const protocol = request.headers['x-forwarded-proto'] || request.protocol;
    return `${protocol}://${request.get('host')}`;
  },
);
