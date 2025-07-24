
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reviews, ReviewsSchema } from 'src/schemas/Review';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reviews.name, schema: ReviewsSchema }]),
    CloudinaryModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule { }
