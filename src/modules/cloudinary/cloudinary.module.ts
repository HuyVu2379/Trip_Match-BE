import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';
import { FolderUploadService } from './folder-upload.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider, FolderUploadService],
  exports: [CloudinaryService, CloudinaryProvider, FolderUploadService],
})
export class CloudinaryModule { }
