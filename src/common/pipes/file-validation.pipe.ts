import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

    transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
        if (!value) {
            throw new BadRequestException('No file uploaded');
        }

        // Check file type
        if (!this.allowedMimeTypes.includes(value.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
            );
        }

        // Check file size
        if (value.size > this.maxFileSize) {
            throw new BadRequestException(
                `File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`
            );
        }

        return value;
    }
}