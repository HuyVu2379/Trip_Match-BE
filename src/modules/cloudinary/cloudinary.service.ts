import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadOptions {
    folder?: string;
    public_id?: string;
    transformation?: any[];
    format?: string;
    quality?: string | number;
}

export interface UploadResponse {
    url: string;
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    created_at: string;
}

export interface FolderUploadResult {
    totalFiles: number;
    successCount: number;
    failedCount: number;
    uploadedFiles: UploadResponse[];
    errors: string[];
}

@Injectable()
export class CloudinaryService {
    constructor(
        private readonly configService: ConfigService,
        @Inject('CLOUDINARY') private readonly cloudinary: any
    ) { }

    /**
     * Upload single image to Cloudinary
     * @param file - Express Multer File
     * @param options - Upload options
     * @returns Promise<UploadResponse>
     */
    async uploadImage(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResponse> {
        // Validate file
        this.validateImageFile(file);
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                resource_type: 'image' as const,
                folder: options?.folder || this.configService.get('CLOUDINARY_FOLDER'),
                public_id: options?.public_id,
                transformation: options?.transformation,
                format: options?.format,
                quality: options?.quality || 'auto',
                ...options
            };

            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        reject(new BadRequestException(`Upload failed: ${error.message}`));
                    } else if (result) {
                        resolve({
                            url: result.url,
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            width: result.width,
                            height: result.height,
                            format: result.format,
                            bytes: result.bytes,
                            created_at: result.created_at
                        });
                    } else {
                        reject(new BadRequestException('Upload failed: No result returned'));
                    }
                }
            ).end(file.buffer);
        });
    }
    /**
     * Upload multiple images to Cloudinary
     * @param files - Array of Express Multer Files
     * @param options - Upload options
     * @returns Promise<UploadResponse[]>
     */
    async uploadMultipleImages(files: Express.Multer.File[], options?: UploadOptions): Promise<UploadResponse[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const uploadPromises = files.map(file => this.uploadImage(file, options));
        return Promise.all(uploadPromises);
    }

    /**
     * Delete image from Cloudinary
     * @param publicId - Public ID of the image to delete
     * @returns Promise<any>
     */
    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(new BadRequestException(`Delete failed: ${error.message}`));
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Delete multiple images from Cloudinary
     * @param publicIds - Array of public IDs to delete
     * @returns Promise<any>
     */
    async deleteMultipleImages(publicIds: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cloudinary.api.delete_resources(publicIds, (error, result) => {
                if (error) {
                    reject(new BadRequestException(`Batch delete failed: ${error.message}`));
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Get image details by public ID
     * @param publicId - Public ID of the image
     * @returns Promise<any>
     */
    async getImageDetails(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cloudinary.api.resource(publicId, (error, result) => {
                if (error) {
                    reject(new BadRequestException(`Get image details failed: ${error.message}`));
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Generate transformed image URL
     * @param publicId - Public ID of the image
     * @param transformations - Transformation options
     * @returns string - Transformed image URL
     */
    generateImageUrl(publicId: string, transformations?: any[]): string {
        return this.cloudinary.url(publicId, {
            transformation: transformations,
            secure: true
        });
    }

    /**
     * Upload image with automatic optimization
     * @param file - Express Multer File
     * @param folder - Folder to upload to
     * @returns Promise<UploadResponse>
     */
    async uploadOptimizedImage(file: Express.Multer.File, folder?: string): Promise<UploadResponse> {
        return this.uploadImage(file, {
            folder: folder || this.configService.get('CLOUDINARY_FOLDER'),
            quality: 'auto:best',
            format: 'auto',
            transformation: [
                { fetch_format: 'auto' },
                { quality: 'auto:best' }
            ]
        });
    }

    /**
     * Upload thumbnail image
     * @param file - Express Multer File
     * @param width - Thumbnail width
     * @param height - Thumbnail height
     * @returns Promise<UploadResponse>
     */
    async uploadThumbnail(file: Express.Multer.File, width: number = 200, height: number = 200): Promise<UploadResponse> {
        return this.uploadImage(file, {
            folder: `${this.configService.get('CLOUDINARY_FOLDER')}/thumbnails`,
            transformation: [
                { width, height, crop: 'fill', gravity: 'auto' },
                { quality: 'auto:good' }
            ]
        });
    }

    /**
     * Upload all images from a local folder to Cloudinary
     * @param folderPath - Local folder path
     * @param cloudinaryFolder - Cloudinary folder name
     * @returns Promise<FolderUploadResult>
     */
    async uploadFolderImages(folderPath: string, cloudinaryFolder?: string): Promise<FolderUploadResult> {
        const result: FolderUploadResult = {
            totalFiles: 0,
            successCount: 0,
            failedCount: 0,
            uploadedFiles: [],
            errors: []
        };

        try {
            if (!fs.existsSync(folderPath)) {
                throw new BadRequestException(`Folder path does not exist: ${folderPath}`);
            }

            const files = await this.getAllImageFiles(folderPath);
            result.totalFiles = files.length;

            for (const filePath of files) {
                try {
                    const fileBuffer = fs.readFileSync(filePath);
                    const fileName = path.basename(filePath, path.extname(filePath));
                    const folderName = path.basename(path.dirname(filePath));

                    // Create a mock Express.Multer.File object
                    const mockFile: Express.Multer.File = {
                        buffer: fileBuffer,
                        originalname: path.basename(filePath),
                        mimetype: this.getMimeType(filePath),
                        size: fileBuffer.length,
                        fieldname: 'file',
                        filename: path.basename(filePath),
                        encoding: '7bit',
                        destination: '',
                        path: filePath,
                        stream: null as any
                    };

                    const uploadResponse = await this.uploadImage(mockFile, {
                        folder: cloudinaryFolder ? `${cloudinaryFolder}/${folderName}` : folderName,
                        public_id: fileName
                    });

                    result.uploadedFiles.push(uploadResponse);
                    result.successCount++;
                } catch (error) {
                    result.failedCount++;
                    result.errors.push(`${filePath}: ${error.message}`);
                }
            }

            return result;
        } catch (error) {
            throw new BadRequestException(`Upload folder failed: ${error.message}`);
        }
    }

    /**
     * Upload all folders recursively from a root path
     * @param rootPath - Root directory path
     * @param cloudinaryRootFolder - Cloudinary root folder name
     * @returns Promise<FolderUploadResult>
     */
    async uploadAllFolders(rootPath: string, cloudinaryRootFolder?: string): Promise<FolderUploadResult> {
        const result: FolderUploadResult = {
            totalFiles: 0,
            successCount: 0,
            failedCount: 0,
            uploadedFiles: [],
            errors: []
        };

        try {
            if (!fs.existsSync(rootPath)) {
                throw new BadRequestException(`Root path does not exist: ${rootPath}`);
            }

            const allFolders = await this.getAllSubFolders(rootPath);

            for (const folderPath of allFolders) {
                try {
                    const folderResult = await this.uploadFolderImages(folderPath, cloudinaryRootFolder);

                    result.totalFiles += folderResult.totalFiles;
                    result.successCount += folderResult.successCount;
                    result.failedCount += folderResult.failedCount;
                    result.uploadedFiles.push(...folderResult.uploadedFiles);
                    result.errors.push(...folderResult.errors);
                } catch (error) {
                    result.errors.push(`Folder ${folderPath}: ${error.message}`);
                }
            }

            return result;
        } catch (error) {
            throw new BadRequestException(`Upload all folders failed: ${error.message}`);
        }
    }

    /**
     * Get all image files from a folder
     * @param folderPath - Folder path
     * @returns Promise<string[]>
     */
    private async getAllImageFiles(folderPath: string): Promise<string[]> {
        const imageFiles: string[] = [];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
                const ext = path.extname(file).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                    imageFiles.push(filePath);
                }
            }
        }

        return imageFiles;
    }

    /**
     * Get all subfolders from a root path
     * @param rootPath - Root directory path
     * @returns Promise<string[]>
     */
    private async getAllSubFolders(rootPath: string): Promise<string[]> {
        const folders: string[] = [];

        const items = fs.readdirSync(rootPath);

        for (const item of items) {
            const itemPath = path.join(rootPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                folders.push(itemPath);
                // Recursively get subfolders
                const subFolders = await this.getAllSubFolders(itemPath);
                folders.push(...subFolders);
            }
        }

        return folders;
    }

    /**
     * Get MIME type based on file extension
     * @param filePath - File path
     * @returns string
     */
    private getMimeType(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        };

        return mimeTypes[ext] || 'application/octet-stream';
    }

    /**
     * Validate image file
     * @param file - Express Multer File
     */
    private validateImageFile(file: Express.Multer.File): void {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size too large. Maximum size is 10MB');
        }

        // Check file type
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
        }
    }
}
