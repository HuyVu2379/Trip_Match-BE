import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from 'src/utils/response.util';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const message = exception.message || 'Authentication failed';
        const errorResponse = ResponseUtil.error(message, 401, 'UNAUTHORIZED');

        response.status(401).json(errorResponse);
    }
}
