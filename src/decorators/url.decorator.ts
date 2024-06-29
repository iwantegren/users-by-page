import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
  },
);

export const HostUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get('host')}`;
  },
);
