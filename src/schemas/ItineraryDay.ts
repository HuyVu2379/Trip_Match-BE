

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { Activities, ActivitiesSchema } from './Activity';
export type ItineraryDaysDocument = HydratedDocument<ItineraryDays>;
@Schema({ timestamps: true })
export class ItineraryDays {
    @Prop({ required: true })
    id: UUID;
    itineraryId: UUID;
    dayNumber: number;
    date: Date;
    title: string;
    notes: [string];
    estimatedBudget: number;
    actualBudget: number;
    // ✅ Gộp hoạt động trong ngày
    @Prop({ type: [{ type: ActivitiesSchema, ref: 'Activities' }] })
    activities: Activities[];
    createdAt: Date;
    updatedAt: Date;
}
export const ItineraryDaysSchema = SchemaFactory.createForClass(ItineraryDays);
