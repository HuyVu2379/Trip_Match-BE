

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type ItineraryDaysDocument = HydratedDocument<ItineraryDays>;
@Schema()
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
    activities: [
        {
            activity_id: UUID | null, // optional, nếu là custom activity thì null
            destination_id: UUID,
            name: string,
            description: string,
            start_time: string,
            end_time: string,
            cost: number,
            order: boolean,
            notes: string
        }
    ];

}
export const ItineraryDaysSchema = SchemaFactory.createForClass(ItineraryDays);
