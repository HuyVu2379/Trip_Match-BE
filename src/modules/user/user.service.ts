import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/User';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dtos';
import { UpdateUserDto } from './dtos/updateInfor-user.dto';
import { NotFoundError } from 'rxjs';
import { UserInterest } from 'src/interfaces/user.interface';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<Users> {
        // Check if user with email already exists
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

        // Create user data
        const userData = {
            ...createUserDto,
            password: hashedPassword,
            dob: new Date(createUserDto.dob),
            interests: createUserDto.interests?.map(interest => ({
                ...interest,
                addedAt: new Date()
            })) || []
        };

        // Create and save user
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<Users | null> {
        return this.userModel.findOne({ id }).exec();
    }

    async updateUser(id: string, updateData: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            throw new ConflictException('User not found');
        }
        const result = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            dob: user.dob,
            gender: user.gender,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            interests: user.interests,
            createdAt: user.createdAt,
            updatedAt: new Date()
        };
        return result;
    }

    async updateAvatar(id: string, avatarUrl: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.avatarUrl = avatarUrl;
        await user.save();
    }

    async updateInterests(id: string, interests: UserInterest[]) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.interests = interests;
        await user.save();
    }
    async deleteInterests(id: string, interestsData: string[]) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.interests = user.interests.filter(interest => !interestsData.includes(interest.interestId));
        await user.save();
    }
}
