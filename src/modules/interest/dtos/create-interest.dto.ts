import { IsNotEmpty, IsString } from "class-validator";
export class CreateInterestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    icon: string;
}