import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type DestinationsDocument = HydratedDocument<Destinations>;
import { PriceLevel, BestSeason, RelevanceLevel } from 'src/enums/destination.enum';
@Schema({ timestamps: true })
export class Destinations {
    @Prop({ required: true, default: () => randomUUID() })
    id: UUID;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: '' })
    addressDetail: string; // Địa chỉ chi tiết

    @Prop({ default: 'Việt Nam' })
    country: string;

    @Prop({ default: '' })
    province: string;

    @Prop({
        type: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
        },
        default: { lat: 0, lng: 0 }
    })
    location: {
        lat: number;
        lng: number;
    };

    @Prop({ type: Number, enum: PriceLevel, default: PriceLevel.MEDIUM })
    priceLevel: PriceLevel; // 1–5

    @Prop({ type: String, enum: BestSeason, default: BestSeason.YEAR_ROUND })
    bestSeason: BestSeason;

    @Prop({ type: [String], default: [] })
    tags: string[]; // ["beach", "cultural"]

    @Prop({ type: [String], default: [] })
    image_url: string[];

    // ✅ Gộp sở thích phù hợp
    @Prop({
        type: [{
            interestId: { type: String, required: true },
            relevance: { type: Number, enum: RelevanceLevel, required: true }
        }],
        default: []
    })
    suitableDestinations: [
        {
            interestId: UUID;
            relevance: RelevanceLevel; // 1–5
        }
    ];

    @Prop({ type: [Number], default: [0, 0] })
    priceRange: [number, number];

    @Prop({ type: [String], default: [] })
    travelTips: string[];

    @Prop({ type: [String], default: [] })
    outstandingLocations: string[]; // ["Phố cổ Hội An", "Vịnh Hạ Long"]

    @Prop({ type: Number, default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    totalReviews: number;

    @Prop({ default: true })
    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const DestinationsSchema = SchemaFactory.createForClass(Destinations);
