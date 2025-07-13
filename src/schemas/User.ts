import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';
export type UsersDocument = HydratedDocument<Users>;
import { Gender, PreferenceLevel, Role } from 'src/enums/user.enum';
import { UserInterest } from 'src/interfaces/user.interface';
@Schema({ timestamps: true })
export class Users {
    @Prop({ required: true, default: () => randomUUID() })
    id: UUID;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ default: null })
    dob: Date;

    @Prop({ enum: Gender, default: Gender.OTHER })
    gender: Gender;

    @Prop({ default: null })
    avatarUrl: string;

    @Prop({ default: null })
    phone: string;

    @Prop({ required: true, enum: Role, default: Role.USER })
    role: Role;
    @Prop({
        type: [{
            interestId: {
                type: String,
                required: true,
                ref: 'Interests'
            },
            preferenceLevel: {
                type: Number,
                required: true,
                enum: Object.values(PreferenceLevel),
                min: 1,
                max: 5
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    })
    interests: UserInterest[];
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);