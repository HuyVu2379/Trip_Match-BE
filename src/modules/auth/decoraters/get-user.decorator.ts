import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { log } from 'console';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        log('GetUser decorator called:', user);
        return data ? user?.[data] : user;
    },
);
