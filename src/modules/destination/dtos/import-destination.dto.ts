import { IsString, IsNotEmpty } from 'class-validator';

export class ImportDestinationDto {
    @IsString()
    @IsNotEmpty()
    filePath: string;
}
