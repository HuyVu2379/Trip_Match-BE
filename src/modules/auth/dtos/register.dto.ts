import { IsEmail, IsString, MinLength, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender } from 'src/enums/user.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsDateString()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
