import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { ItineraryStatus, MatchedScore, GeneratedBy } from 'src/enums/itinerary.enum';
export type ItinerariesDocument = HydratedDocument<Itineraries>;
@Schema({ timestamps: true })
export class Itineraries {
    @Prop({ required: true })
    id: UUID;
    @Prop({ required: true })
    userId: UUID;
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    startDate: Date;
    @Prop({ required: true })
    endDate: Date;
    @Prop({ required: true, type: [String], default: [] })
    imageUrl: string[];
    @Prop({ required: true, type: Number, default: 0 })
    totalBudget: number;
    @Prop({ required: true, type: Number, default: 0 })
    estimatedCost: number;
    @Prop({ required: true, type: Number, default: 0 })
    actualCost: number;
    @Prop({ required: true, type: String, enum: ItineraryStatus })
    status: ItineraryStatus;
    // ✅ Gộp thông tin gợi ý (nếu có)
    @Prop({
        required: true, type: {
            generatedBy: { type: String, enum: GeneratedBy, required: true },
            baseInterests: [{ type: String, required: true }],
            matchedScore: { type: Number, enum: MatchedScore, required: true }
        }
    })
    suggestionMetadata: {
        generatedBy: GeneratedBy;
        baseInterests: UUID[];
        matchedScore: MatchedScore;
    };
    createdAt: Date;
    updatedAt: Date;
}

export const ItinerariesSchema = SchemaFactory.createForClass(Itineraries);
