import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UUID } from "crypto";
import { ReviewRating } from "src/enums/review.enum";

export class UpdateReviews {
    @IsString()
    @IsNotEmpty()
    userId: UUID;
    @IsString()
    @IsNotEmpty()
    targetId: UUID;
    @IsNumber()
    rating: ReviewRating;
    @IsString()
    content: string;
}