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
    Body,
    Res,
    Options,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService, UploadResponse, FolderUploadResult } from './cloudinary.service';
import { FolderUploadService } from './folder-upload.service';
import { ConfigService } from '@nestjs/config';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(
        private configService: ConfigService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly folderUploadService: FolderUploadService
    ) { }

    /**
     * Handle CORS preflight requests
     */
    @Options('*')
    handleOptions(@Res() res): void {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.status(204).send();
    }

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
        folder = folder || this.configService.get('CLOUDINARY_FOLDER');
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

    /**
     * Upload all images from a local folder
     */
    @Post('upload/folder')
    async uploadFolder(
        @Body('folderPath') folderPath: string,
        @Body('cloudinaryFolder') cloudinaryFolder?: string,
    ): Promise<{ message: string; data: FolderUploadResult }> {
        if (!folderPath) {
            throw new BadRequestException('Folder path is required');
        }

        const result = await this.cloudinaryService.uploadFolderImages(folderPath, cloudinaryFolder);
        return {
            message: `Folder upload completed. Success: ${result.successCount}, Failed: ${result.failedCount}`,
            data: result,
        };
    }

    /**
     * Upload all folders recursively from a root path
     */
    @Post('upload/all-folders')
    async uploadAllFolders(
        @Body('rootPath') rootPath: string,
        @Body('cloudinaryRootFolder') cloudinaryRootFolder?: string,
    ): Promise<{ message: string; data: FolderUploadResult }> {
        if (!rootPath) {
            throw new BadRequestException('Root path is required');
        }

        const result = await this.cloudinaryService.uploadAllFolders(rootPath, cloudinaryRootFolder);
        return {
            message: `All folders upload completed. Success: ${result.successCount}, Failed: ${result.failedCount}`,
            data: result,
        };
    }

    /**
     * Get folder structure information
     */
    @Get('folder-structure')
    async getFolderStructure(@Query('path') folderPath: string) {
        if (!folderPath) {
            throw new BadRequestException('Folder path is required');
        }

        const structure = await this.folderUploadService.getFolderStructure(folderPath);
        return {
            message: 'Folder structure retrieved successfully',
            data: structure,
        };
    }

    /**
     * Get list of all provinces
     */
    @Get('provinces')
    async getProvinceList() {
        const provinces = await this.folderUploadService.getProvinceList();
        return {
            message: 'Province list retrieved successfully',
            data: provinces,
        };
    }

    /**
     * Upload specific provinces
     */
    @Post('upload/provinces')
    async uploadSpecificProvinces(
        @Body('provinces') provinces: string[]
    ): Promise<{ message: string; data: FolderUploadResult }> {
        if (!provinces || provinces.length === 0) {
            throw new BadRequestException('Province list is required');
        }

        const result = await this.folderUploadService.uploadSpecificProvinces(provinces);
        return {
            message: `Provinces upload completed. Success: ${result.successCount}, Failed: ${result.failedCount}`,
            data: result,
        };
    }

    /**
     * Get total image count
     */
    @Get('image-count')
    async getTotalImageCount() {
        const count = await this.folderUploadService.getTotalImageCount();
        return {
            message: 'Total image count retrieved successfully',
            data: { count },
        };
    }

    /**
     * Upload ImageProvince with progress
     */
    @Post('upload/image-province-progress')
    async uploadImageProvinceWithProgress(): Promise<{ message: string; data: FolderUploadResult }> {
        const result = await this.folderUploadService.uploadImageProvinceWithProgress();
        return {
            message: `Image Province upload completed. Success: ${result.successCount}, Failed: ${result.failedCount}`,
            data: result,
        };
    }

    /**
     * Upload specific folder (ImageProvince)
     */
    @Post('upload/image-province')
    async uploadImageProvince(): Promise<{ message: string; data: FolderUploadResult }> {
        const rootPath = 'D:\\SideProject\\CrawData\\ImageProvice';
        const cloudinaryRootFolder = 'provinces';

        const result = await this.cloudinaryService.uploadAllFolders(rootPath, cloudinaryRootFolder);
        return {
            message: `Image Province upload completed. Success: ${result.successCount}, Failed: ${result.failedCount}`,
            data: result,
        };
    }

    /**
     * Serve upload interface
     */
    @Get('upload-interface')
    async getUploadInterface(@Res() res): Promise<void> {
        const fs = require('fs');
        const path = require('path');
        const htmlPath = path.join(__dirname, 'upload-interface.html');

        try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            throw new BadRequestException('Upload interface not found');
        }
    }

    /**
     * Serve advanced upload interface
     */
    @Get('advanced-upload-interface')
    async getAdvancedUploadInterface(@Res() res): Promise<void> {
        const fs = require('fs');
        const path = require('path');
        const htmlPath = path.join(__dirname, 'advanced-upload-interface.html');

        try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            throw new BadRequestException('Advanced upload interface not found');
        }
    }

    /**
     * Serve server status check page
     */
    @Get('server-status')
    async getServerStatus(@Res() res): Promise<void> {
        const fs = require('fs');
        const path = require('path');
        const htmlPath = path.join(__dirname, 'server-status.html');

        try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            throw new BadRequestException('Server status page not found');
        }
    }
}
