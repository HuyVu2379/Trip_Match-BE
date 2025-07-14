import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type DestinationsDocument = HydratedDocument<Destinations>;
import { PriceLevel, BestSeason, RelevanceLevel } from 'src/enums/destination.enum';
@Schema({ timestamps: true })
export class Destinations {
    @Prop({ required: true, default: () => randomUUID() })
    id: UUID;
    name: string;
    description: string;
    @Prop({ default: 'Việt Nam' })
    country: string;
    province: string;
    location: {
        lat: number;
        lng: number;
    };
    priceLevel: PriceLevel; // 1–5
    bestSeason: BestSeason;
    tags: string[]; // ["beach", "cultural"]
    image_url: string[];
    // ✅ Gộp sở thích phù hợp
    suitableDestinations: [
        {
            interestId: UUID;
            relevance: RelevanceLevel; // 1–5
        }
    ];
    priceRange: [number, number];
    travelTips: string[];
    outstandingLocations: string[]; // ["Phố cổ Hội An", "Vịnh Hạ Long"]
    averageRating: number;
    totalReviews: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const DestinationsSchema = SchemaFactory.createForClass(Destinations);
