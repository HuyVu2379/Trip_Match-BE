import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reviews, ReviewsDocument } from 'src/schemas/Review';
import { CreateReviews } from './dtos/create-review-dto';
import { UpdateReviews } from './dtos/update-review-dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Reviews.name) private reviewModel: Model<ReviewsDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    /**
     * Create a review, upload images if files are provided
     * @param data - review data
     * @param files - optional array of Express.Multer.File
     */
    async createReview(data: CreateReviews, files?: Express.Multer.File[]) {
        let photoUrls: string[] = [];
        if (files && files.length > 0) {
            const uploaded = await this.cloudinaryService.uploadMultipleImages(files);
            photoUrls = uploaded.map(img => img.secure_url);
        }
        const newReview = new this.reviewModel({
            ...data,
            photos: photoUrls.length > 0 ? photoUrls : data.photos || null,
        });
        return await newReview.save();
    }
    async deleteReview(id: string) {
        const result = await this.reviewModel.deleteOne({ id: id });
        if (result.deletedCount === 0) {
            throw new Error(`Review with id ${id} not found`);
        }
        return true;
    }
    async getReviewByTargetIdWithPage(targetId: string, page: number, limit: number) {
        const reviews = await this.reviewModel.find({ targetId: targetId })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        if (!reviews || reviews.length === 0) {
            throw new Error(`No reviews found for targetId ${targetId}`);
        }
        return reviews;
    }
    async updateReview(id: string, data: UpdateReviews) {
        const result = await this.reviewModel.updateOne({ id: id }, { $set: data });
        if (result.modifiedCount === 0) {
            throw new Error(`Review with id ${id} not found`);
        }
        return true;
    }
}
