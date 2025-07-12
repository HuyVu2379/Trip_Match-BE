import { IsEmail, IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsArray, ValidateNested } from 'class-validator';
import { Gender } from 'src/enums/user.enum';
import { UserInterest } from 'src/interfaces/user.interface';

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
    interests?: UserInterest[];
}
