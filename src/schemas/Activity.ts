import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { RecommendedTime, TypeActivity, TypeUserCost } from 'src/enums/activity.enum';
import { RelevanceLevel } from 'src/enums/destination.enum';
import { ActivityCost } from 'src/interfaces/activity.interface';
export type ActivitiesDocument = HydratedDocument<Activities>;
@Schema({ timestamps: true })
export class Activities {
    @Prop({ required: true })
    id: UUID;
    @Prop({ required: true })
    destinationId: UUID;
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    description: string;
    @Prop({ default: '' })
    addressDetail: string;
    @Prop({ required: true })
    durationMinutes: number;
    @Prop({
        required: true, type: {
            cost: { type: Number, required: true },
            per: { type: String, enum: TypeUserCost, required: true }
        }
    })
    cost: ActivityCost;
    @Prop({ required: true, type: [String], default: [] })
    imageUrl: string[];
    @Prop({ default: null })
    averageRating: number;
    @Prop({ type: String, enum: RecommendedTime, default: RecommendedTime.ANYTIME })
    recommendedTime: RecommendedTime;
    @Prop({ type: [String], enum: TypeActivity, default: [] })
    tags: TypeActivity[];
    @Prop({ type: [String], default: [] })
    @Prop({
        type: [{
            interestId: { type: String, required: true },
            relevance: { type: Number, enum: RelevanceLevel, required: true }
        }],
        default: []
    })
    suitableInterests: [
        {
            interestId: UUID;
            relevance: RelevanceLevel; // 1–5s
        }
    ];
    createdAt: Date;
    updatedAt: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
