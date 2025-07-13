import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

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
