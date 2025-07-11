import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus,
        public readonly code: string,
        public readonly details?: string,
    ) {
        super(message, statusCode);
    }
}

export class ValidationException extends CustomException {
    constructor(message: string = 'Validation failed', details?: string) {
        super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
    }
}

export class BusinessLogicException extends CustomException {
    constructor(message: string, details?: string) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'BUSINESS_LOGIC_ERROR', details);
    }
}

export class ResourceNotFoundException extends CustomException {
    constructor(resource: string = 'Resource', details?: string) {
        super(`${resource} not found`, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND', details);
    }
}

export class DuplicateResourceException extends CustomException {
    constructor(resource: string = 'Resource', details?: string) {
        super(`${resource} already exists`, HttpStatus.CONFLICT, 'DUPLICATE_RESOURCE', details);
    }
}
