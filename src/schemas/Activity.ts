import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { RecommendedTime, TypeActivity } from 'src/enums/activity.enum';
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
    addressDetail: string;
    @Prop({ required: true })
    durationMinutes: number;
    @Prop({ required: true, type: Object })
    cost: ActivityCost;
    imageUrl: string[];
    @Prop({ default: null })
    averageRating: number;
    recommendedTime: RecommendedTime;
    tags: TypeActivity[];
    createdAt: Date;
    updatedAt: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
