import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService, UploadResponse } from './cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private configService: ConfigService,
        private readonly cloudinaryService: CloudinaryService) { }

    /**
     * Upload single image
     */
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder?: string,
    ): Promise<{ message: string; data: UploadResponse }> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        folder = this.configService.get('CLOUDINARY_FOLDER');
        const result = await this.cloudinaryService.uploadImage(file, { folder });
        return {
            message: 'Image uploaded successfully',
            data: result,
        };
    }

    /**
     * Upload optimized image
     */
    @Post('upload/optimized')
    @UseInterceptors(FileInterceptor('image'))
    async uploadOptimizedImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder?: string,
    ): Promise<{ message: string; data: UploadResponse }> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const result = await this.cloudinaryService.uploadOptimizedImage(file, folder);
        return {
            message: 'Optimized image uploaded successfully',
            data: result,
        };
    }

    /**
     * Upload thumbnail
     */
    @Post('upload/thumbnail')
    @UseInterceptors(FileInterceptor('image'))
    async uploadThumbnail(
        @UploadedFile() file: Express.Multer.File,
        @Query('width') width?: number,
        @Query('height') height?: number,
    ): Promise<{ message: string; data: UploadResponse }> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const result = await this.cloudinaryService.uploadThumbnail(
            file,
            width || 200,
            height || 200,
        );
        return {
            message: 'Thumbnail uploaded successfully',
            data: result,
        };
    }

    /**
     * Upload multiple images
     */
    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('images', 10))
    async uploadMultipleImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('folder') folder?: string,
    ): Promise<{ message: string; data: UploadResponse[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const results = await this.cloudinaryService.uploadMultipleImages(files, {
            folder,
        });
        return {
            message: `${results.length} images uploaded successfully`,
            data: results,
        };
    }

    /**
     * Delete image by public ID
     */
    @Delete(':publicId')
    async deleteImage(@Param('publicId') publicId: string) {
        const result = await this.cloudinaryService.deleteImage(publicId);
        return {
            message: 'Image deleted successfully',
            data: result,
        };
    }

    /**
     * Delete multiple images
     */
    @Delete('batch/:publicIds')
    async deleteMultipleImages(@Param('publicIds') publicIds: string) {
        const publicIdArray = publicIds.split(',');
        const result = await this.cloudinaryService.deleteMultipleImages(publicIdArray);
        return {
            message: `${publicIdArray.length} images deleted successfully`,
            data: result,
        };
    }

    /**
     * Get image details
     */
    @Get('details/:publicId')
    async getImageDetails(@Param('publicId') publicId: string) {
        const result = await this.cloudinaryService.getImageDetails(publicId);
        return {
            message: 'Image details retrieved successfully',
            data: result,
        };
    }

    /**
     * Generate transformed image URL
     */
    @Get('transform/:publicId')
    async generateTransformedUrl(
        @Param('publicId') publicId: string,
        @Query('width') width?: number,
        @Query('height') height?: number,
        @Query('quality') quality?: string,
        @Query('format') format?: string,
    ) {
        const transformations: any[] = [];

        if (width && height) {
            transformations.push({ width, height, crop: 'fill' });
        }
        if (quality) {
            transformations.push({ quality });
        }
        if (format) {
            transformations.push({ format });
        }

        const url = this.cloudinaryService.generateImageUrl(
            publicId,
            transformations.length > 0 ? transformations : undefined,
        );

        return {
            message: 'Transformed URL generated successfully',
            data: { url },
        };
    }
}
