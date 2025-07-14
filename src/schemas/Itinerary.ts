import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { ItineraryStatus, MatchedScore, GeneratedBy } from 'src/enums/itinerary.enum';
export type ItinerariesDocument = HydratedDocument<Itineraries>;
@Schema({ timestamps: true })
export class Itineraries {
    @Prop({ required: true })
    id: UUID;
    userId: UUID;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string[];
    totalBudget: number;
    estimatedCost: number;
    actualCost: number;
    status: ItineraryStatus;
    // ✅ Gộp thông tin gợi ý (nếu có)
    suggestionMetadata: {
        generatedBy: GeneratedBy;
        baseInterests: [UUID],
        matchedScore: MatchedScore
    };
    createdAt: Date;
    updatedAt: Date;
}

export const ItinerariesSchema = SchemaFactory.createForClass(Itineraries);
