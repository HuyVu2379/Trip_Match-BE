import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { RecommendedTime } from 'src/enums/activity.enum';
export type ActivitiesDocument = HydratedDocument<Activities>;
@Schema({ timestamps: true })
export class Activities {
    @Prop({ required: true })
    id: UUID;
    destination_id: UUID;
    name: string;
    description: string;
    duration_minutes: number;
    cost: number;
    image_url: string;
    recommended_time: RecommendedTime;
    tags: string[];
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
