import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { ReviewRating, ReviewTargetType } from 'src/enums/review.enum';
export type ReviewsDocument = HydratedDocument<Reviews>;
@Schema({ timestamps: true })
export class Reviews {
    @Prop({ required: true, unique: true, default: () => randomUUID() })
    id: UUID;
    @Prop({ required: true })
    userId: UUID;
    targetType: ReviewTargetType;
    @Prop({ required: true })
    targetId: UUID;
    @Prop({ required: true })
    rating: ReviewRating;
    content: string;
    photos: string[] | null;
    visitDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
