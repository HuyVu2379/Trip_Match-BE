import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { UUID } from 'crypto';
export class ItineraryDayDto {
    @IsString()
    itineraryId: UUID;
    @IsNumber()
    dayNumber: number;
    @IsDate()
    date: Date;
    @IsString()
    title: string;
    @IsArray()
    notes: string[];
    @IsNumber()
    estimatedBudget: number;
    @IsNumber()
    actualBudget: number;
}
