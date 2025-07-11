import { Gender } from 'src/enums/user.enum';
import { UserInterest } from 'src/interfaces/user.interface';

export class UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    dob: Date;
    gender: Gender;
    avatarUrl?: string;
    phone?: string;
    interests: UserInterest[];
    createdAt: Date;
    updatedAt: Date;
}
