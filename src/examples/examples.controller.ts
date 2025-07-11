import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ResponseUtil } from '../utils/response.util';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
    ValidationException,
    ResourceNotFoundException,
    DuplicateResourceException
} from '../common/exceptions/custom.exception';

@Controller('examples')
export class ExamplesController {

    // Ví dụ success response đơn giản
    @Get('success')
    getSuccess(): ApiResponse {
        return ResponseUtil.success(
            { message: 'This is a success response' },
            'Operation completed successfully'
        );
    }

    // Ví dụ success response với data phức tạp
    @Get('users')
    getUsers(): ApiResponse {
        const users = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];

        return ResponseUtil.success(users, 'Users retrieved successfully');
    }

    // Ví dụ validation error
    @Post('validate')
    validateData(@Body() data: any): ApiResponse {
        if (!data.email || !data.email.includes('@')) {
            throw new ValidationException('Invalid email format', 'Email must contain @ symbol');
        }

        return ResponseUtil.success(data, 'Data validated successfully');
    }

    // Ví dụ not found error
    @Get('users/:id')
    getUserById(@Param('id') id: string): ApiResponse {
        if (id === '999') {
            throw new ResourceNotFoundException('User', `User with ID ${id} not found`);
        }

        const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
        return ResponseUtil.success(user, 'User retrieved successfully');
    }

    // Ví dụ duplicate resource error
    @Post('users')
    createUser(@Body() userData: any): ApiResponse {
        if (userData.email === 'existing@example.com') {
            throw new DuplicateResourceException('User', 'Email already exists in the system');
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date()
        };

        return ResponseUtil.success(newUser, 'User created successfully', 201);
    }

    // Ví dụ response tự động format (không dùng ResponseUtil)
    @Get('auto-format')
    getAutoFormat() {
        // Response sẽ được tự động format bởi ResponseInterceptor
        return {
            message: 'This will be auto-formatted',
            timestamp: new Date(),
            data: [1, 2, 3, 4, 5]
        };
    }

    // Ví dụ error được throw tự động
    @Get('error/:type')
    throwError(@Param('type') type: string) {
        switch (type) {
            case 'validation':
                throw new ValidationException('This is a validation error');
            case 'notfound':
                throw new ResourceNotFoundException('Item');
            case 'duplicate':
                throw new DuplicateResourceException('Item');
            case 'generic':
                throw new Error('This is a generic error');
            default:
                return { message: 'No error thrown' };
        }
    }
}
