import { IsEmail, IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, PreferenceLevel } from 'src/enums/user.enum';


export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsDateString()
    dob: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsString()
    phone?: string;
}
