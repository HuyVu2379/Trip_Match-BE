

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { Activities, ActivitiesSchema } from './Activity';
export type ItineraryDaysDocument = HydratedDocument<ItineraryDays>;
@Schema({ timestamps: true })
export class ItineraryDays {
    @Prop({ required: true })
    id: UUID;
    @Prop({ required: true })
    itineraryId: UUID;
    @Prop({ required: true })
    dayNumber: number;
    @Prop({ required: true })
    date: Date;
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    notes: string[];
    @Prop({ required: true, type: Number, default: 0 })
    estimatedBudget: number;
    @Prop({ required: true, type: Number, default: 0 })
    actualBudget: number;
    // ✅ Gộp hoạt động trong ngày
    @Prop({ type: [{ type: ActivitiesSchema, ref: 'Activities' }] })
    activities: Activities[];
    createdAt: Date;
    updatedAt: Date;
}
export const ItineraryDaysSchema = SchemaFactory.createForClass(ItineraryDays);
