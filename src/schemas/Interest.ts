import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type InterestsDocument = HydratedDocument<Interests>;
@Schema({ timestamps: true })
export class Interests {
    @Prop({ required: true, unique: true, default: () => randomUUID() })
    id: UUID;
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    icon: string;
    createdAt: Date;
    updatedAt: Date;
}

export const InterestsSchema = SchemaFactory.createForClass(Interests);
