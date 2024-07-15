import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    console.log({ reqUrl_http: request.protocol });
    return `${request.protocol}://${request.get('host')}${request.baseUrl}${request.path}`;
  },
);

export const HostUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    console.log({ hostUrl_http: request.protocol });
    return `${request.protocol}://${request.get('host')}`;
  },
);
