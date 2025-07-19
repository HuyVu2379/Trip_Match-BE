import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService, FolderUploadResult } from './cloudinary.service';
import * as fs from 'fs';
import * as path from 'path';

export interface FolderInfo {
    name: string;
    path: string;
    imageCount: number;
    subFolders: FolderInfo[];
}

@Injectable()
export class FolderUploadService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    /**
     * Get folder structure information
     * @param rootPath - Root directory path
     * @returns Promise<FolderInfo>
     */
    async getFolderStructure(rootPath: string): Promise<FolderInfo> {
        if (!fs.existsSync(rootPath)) {
            throw new BadRequestException(`Path does not exist: ${rootPath}`);
        }

        const folderName = path.basename(rootPath);
        const folderInfo: FolderInfo = {
            name: folderName,
            path: rootPath,
            imageCount: 0,
            subFolders: []
        };

        const items = fs.readdirSync(rootPath);

        for (const item of items) {
            const itemPath = path.join(rootPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                const subFolderInfo = await this.getFolderStructure(itemPath);
                folderInfo.subFolders.push(subFolderInfo);
            } else if (stat.isFile()) {
                if (this.isImageFile(item)) {
                    folderInfo.imageCount++;
                }
            }
        }

        return folderInfo;
    }

    /**
     * Upload ImageProvince folder with progress tracking
     * @returns Promise<FolderUploadResult>
     */
    async uploadImageProvinceWithProgress(): Promise<FolderUploadResult> {
        const rootPath = 'D:\\SideProject\\CrawData\\ImageProvice';
        const cloudinaryRootFolder = 'provinces';

        // First, get folder structure
        const folderStructure = await this.getFolderStructure(rootPath);
        console.log('Folder structure:', JSON.stringify(folderStructure, null, 2));

        // Upload all folders
        const result = await this.cloudinaryService.uploadAllFolders(rootPath, cloudinaryRootFolder);

        return result;
    }

    /**
     * Upload specific provinces
     * @param provinceNames - Array of province names to upload
     * @returns Promise<FolderUploadResult>
     */
    async uploadSpecificProvinces(provinceNames: string[]): Promise<FolderUploadResult> {
        const rootPath = 'D:\\SideProject\\CrawData\\ImageProvice';
        const cloudinaryRootFolder = 'provinces';

        const result: FolderUploadResult = {
            totalFiles: 0,
            successCount: 0,
            failedCount: 0,
            uploadedFiles: [],
            errors: []
        };

        for (const provinceName of provinceNames) {
            const provincePath = path.join(rootPath, provinceName);

            if (fs.existsSync(provincePath)) {
                try {
                    const folderResult = await this.cloudinaryService.uploadFolderImages(
                        provincePath,
                        `${cloudinaryRootFolder}/${provinceName}`
                    );

                    result.totalFiles += folderResult.totalFiles;
                    result.successCount += folderResult.successCount;
                    result.failedCount += folderResult.failedCount;
                    result.uploadedFiles.push(...folderResult.uploadedFiles);
                    result.errors.push(...folderResult.errors);
                } catch (error) {
                    result.errors.push(`Province ${provinceName}: ${error.message}`);
                }
            } else {
                result.errors.push(`Province folder not found: ${provinceName}`);
            }
        }

        return result;
    }

    /**
     * Get list of all provinces
     * @returns Promise<string[]>
     */
    async getProvinceList(): Promise<string[]> {
        const rootPath = 'D:\\SideProject\\CrawData\\ImageProvice';
        const provinces: string[] = [];

        if (!fs.existsSync(rootPath)) {
            throw new BadRequestException(`Root path does not exist: ${rootPath}`);
        }

        const items = fs.readdirSync(rootPath);

        for (const item of items) {
            const itemPath = path.join(rootPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                provinces.push(item);
            }
        }

        return provinces.sort();
    }

    /**
     * Check if file is an image
     * @param fileName - File name
     * @returns boolean
     */
    private isImageFile(fileName: string): boolean {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(fileName).toLowerCase();
        return allowedExtensions.includes(ext);
    }

    /**
     * Get total image count from all provinces
     * @returns Promise<number>
     */
    async getTotalImageCount(): Promise<number> {
        const rootPath = 'D:\\SideProject\\CrawData\\ImageProvice';
        let totalCount = 0;

        if (!fs.existsSync(rootPath)) {
            return 0;
        }

        const items = fs.readdirSync(rootPath);

        for (const item of items) {
            const itemPath = path.join(rootPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                const folderImages = await this.getImageCountInFolder(itemPath);
                totalCount += folderImages;
            }
        }

        return totalCount;
    }

    /**
     * Get image count in a specific folder
     * @param folderPath - Folder path
     * @returns Promise<number>
     */
    private async getImageCountInFolder(folderPath: string): Promise<number> {
        let count = 0;

        const items = fs.readdirSync(folderPath);

        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isFile() && this.isImageFile(item)) {
                count++;
            } else if (stat.isDirectory()) {
                const subFolderCount = await this.getImageCountInFolder(itemPath);
                count += subFolderCount;
            }
        }

        return count;
    }
}
