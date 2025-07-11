import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { RecommendedTime } from 'src/enums/activity.enum';
export type ActivitiesDocument = HydratedDocument<Activities>;
@Schema()
export class Activities {
    @Prop({ required: true })
    id: UUID;
    destination_id: UUID;
    name: string;
    description: string;
    duration_minutes: number;
    cost: number;
    recommended_time: RecommendedTime;
    tags: string[];
    created_at: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
