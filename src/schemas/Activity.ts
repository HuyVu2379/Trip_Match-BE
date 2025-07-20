import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { RecommendedTime, TypeActivity, TypeUserCost } from 'src/enums/activity.enum';
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
    createdAt: Date;
    updatedAt: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
