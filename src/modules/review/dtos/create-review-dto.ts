import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UUID } from "crypto";
import { ReviewRating, ReviewTargetType } from "src/enums/review.enum";

export class CreateReviews {
    @IsString()
    @IsNotEmpty()
    userId: UUID;
    @IsString()
    @IsNotEmpty()
    targetType: ReviewTargetType;
    @IsString()
    @IsNotEmpty()
    targetId: UUID;
    @IsNumber()
    rating: ReviewRating;
    @IsString()
    content: string;
    @IsArray()
    photos: string[] | null;
    @IsDate()
    visitDate: Date;
}