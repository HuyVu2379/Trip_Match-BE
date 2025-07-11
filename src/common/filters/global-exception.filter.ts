import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from '../../utils/response.util';
import { CustomException } from '../exceptions/custom.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status: number;
        let message: string;
        let code: string;
        let details: string | undefined;

        if (exception instanceof CustomException) {
            status = exception.getStatus();
            message = exception.message;
            code = exception.code;
            details = exception.details;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                details = Array.isArray(responseObj.message)
                    ? responseObj.message.join(', ')
                    : responseObj.message;
            } else {
                message = exception.message;
            }

            // Determine error code based on status
            switch (status) {
                case HttpStatus.BAD_REQUEST:
                    code = 'BAD_REQUEST';
                    break;
                case HttpStatus.UNAUTHORIZED:
                    code = 'UNAUTHORIZED';
                    break;
                case HttpStatus.FORBIDDEN:
                    code = 'FORBIDDEN';
                    break;
                case HttpStatus.NOT_FOUND:
                    code = 'NOT_FOUND';
                    break;
                case HttpStatus.CONFLICT:
                    code = 'CONFLICT';
                    break;
                case HttpStatus.UNPROCESSABLE_ENTITY:
                    code = 'VALIDATION_ERROR';
                    break;
                default:
                    code = 'HTTP_ERROR';
            }
        } else {
            // Handle non-HTTP exceptions
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            code = 'INTERNAL_SERVER_ERROR';
            details = exception.message || 'An unexpected error occurred';
        }

        const errorResponse = ResponseUtil.error(message, status, code, details);

        response.status(status).json(errorResponse);
    }
}
