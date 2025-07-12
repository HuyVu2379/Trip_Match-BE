import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type DestinationsDocument = HydratedDocument<Destinations>;
import { PriceLevel, BestSeason, RelevanceLevel } from 'src/enums/destination.enum';
@Schema({ timestamps: true })
export class Destinations {
    @Prop({ required: true })
    id: UUID;
    name: string;
    description: string;
    country: string;
    province: string;
    location: {
        lat: number;
        lng: number;
    };
    price_level: PriceLevel; // 1–5
    best_season: BestSeason;
    tags: string[]; // ["beach", "cultural"]
    image_url: string[];
    // ✅ Gộp sở thích phù hợp
    suitable_Destinations: [
        {
            interest_id: UUID;
            relevance: RelevanceLevel; // 1–5
        }
    ];

    average_rating: number;
    total_reviews: number;
    is_active: boolean;
    created_at: Date;
}

export const DestinationsSchema = SchemaFactory.createForClass(Destinations);
