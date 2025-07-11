import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
    static success<T>(
        data: T,
        message: string = 'Success',
        statusCode: number = 200,
    ): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            statusCode,
        };
    }

    static error(
        message: string,
        statusCode: number = 400,
        code: string = 'BAD_REQUEST',
        details?: string,
    ): ApiResponse {
        return {
            success: false,
            message,
            error: {
                code,
                details,
                timestamp: new Date().toISOString(),
            },
            statusCode,
        };
    }

    static validationError(
        message: string = 'Validation failed',
        details?: string,
    ): ApiResponse {
        return this.error(message, 400, 'VALIDATION_ERROR', details);
    }

    static unauthorizedError(
        message: string = 'Unauthorized',
        details?: string,
    ): ApiResponse {
        return this.error(message, 401, 'UNAUTHORIZED', details);
    }

    static forbiddenError(
        message: string = 'Forbidden',
        details?: string,
    ): ApiResponse {
        return this.error(message, 403, 'FORBIDDEN', details);
    }

    static notFoundError(
        message: string = 'Not found',
        details?: string,
    ): ApiResponse {
        return this.error(message, 404, 'NOT_FOUND', details);
    }

    static conflictError(
        message: string = 'Conflict',
        details?: string,
    ): ApiResponse {
        return this.error(message, 409, 'CONFLICT', details);
    }

    static internalServerError(
        message: string = 'Internal server error',
        details?: string,
    ): ApiResponse {
        return this.error(message, 500, 'INTERNAL_SERVER_ERROR', details);
    }
}
