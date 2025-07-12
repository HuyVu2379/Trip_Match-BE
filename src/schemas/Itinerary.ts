import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { ItineraryStatus, MatchedScore, GeneratedBy } from 'src/enums/itinerary.enum';
export type ItinerariesDocument = HydratedDocument<Itineraries>;
@Schema({ timestamps: true })
export class Itineraries {
    @Prop({ required: true })
    id: UUID;
    user_id: UUID;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    imageUrl: string[];
    total_budget: number;
    estimated_cost: number;
    actual_cost: number;
    status: ItineraryStatus;
    // ✅ Gộp thông tin gợi ý (nếu có)
    suggestion_metadata: {
        generated_by: GeneratedBy;
        base_interests: [UUID],
        matched_score: MatchedScore
    };
}

export const ItinerariesSchema = SchemaFactory.createForClass(Itineraries);
