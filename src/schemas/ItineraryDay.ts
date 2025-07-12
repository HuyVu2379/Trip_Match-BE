

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { Activities, ActivitiesSchema } from './Activity';
export type ItineraryDaysDocument = HydratedDocument<ItineraryDays>;
@Schema({ timestamps: true })
export class ItineraryDays {
    @Prop({ required: true })
    id: UUID;
    itinerary_id: UUID;
    day_number: number;
    date: Date;
    title: string;
    notes: [string];
    estimated_budget: number;
    actual_budget: number;
    // ✅ Gộp hoạt động trong ngày
    @Prop({ type: [{ type: ActivitiesSchema, ref: 'Activities' }] })
    activities: Activities[];

}
export const ItineraryDaysSchema = SchemaFactory.createForClass(ItineraryDays);
