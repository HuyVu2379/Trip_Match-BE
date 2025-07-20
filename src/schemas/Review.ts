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
    @Prop({ required: true, type: String, enum: ReviewTargetType })
    targetType: ReviewTargetType;
    @Prop({ required: true })
    targetId: UUID;
    @Prop({ required: true })
    rating: ReviewRating;
    @Prop({ required: true, minlength: 10, maxlength: 1000 })
    content: string;
    @Prop({ type: [String], default: null })
    photos: string[] | null;
    @Prop({ default: null })
    visitDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
