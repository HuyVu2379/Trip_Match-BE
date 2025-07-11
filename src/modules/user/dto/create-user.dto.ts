import { IsEmail, IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, PreferenceLevel } from 'src/enums/user.enum';

export class UserInterestDto {
    @IsString()
    @IsNotEmpty()
    interestId: string;

    @IsEnum(PreferenceLevel)
    preferenceLevel: PreferenceLevel;
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsDateString()
    dob: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserInterestDto)
    interests?: UserInterestDto[];
}
