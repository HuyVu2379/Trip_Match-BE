import { IsString, IsNotEmpty } from 'class-validator';

export class ImportActivityDto {
    @IsString()
    @IsNotEmpty()
    filePath: string;
}
