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
    user_id: UUID;
    target_type: ReviewTargetType;
    @Prop({ required: true })
    target_id: UUID;
    @Prop({ required: true })
    rating: ReviewRating;
    content: string;
    photos: string[] | null;
    visit_date: Date;
}
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
