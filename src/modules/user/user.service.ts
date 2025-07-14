import { Injectable, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/User';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/updateInfor-user.dto';
import { NotFoundError } from 'rxjs';
import { UserInterest } from 'src/interfaces/user.interface';
import { ApiResponse, ResponseUtil } from 'src/common';
import { CloudinaryService } from '../cloudinary';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Users.name) private userModel: Model<UsersDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<ApiResponse> {
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
        createdUser.save();
        return ResponseUtil.success(createdUser, 'User created successfully', 201);
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<Users | null> {
        return this.userModel.findOne({ id }).exec();
    }

    async updateUser(id: string, updateData: UpdateUserDto): Promise<ApiResponse> {
        const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            throw new NotFoundError('User not found');
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
        return ResponseUtil.success(result, 'User updated successfully', HttpStatus.OK);
    }

    async updateAvatar(id: string, image: Express.Multer.File): Promise<string> {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }

            // Upload image to Cloudinary
            const uploadResult = await this.cloudinaryService.uploadImage(image, {
                folder: 'TripMatch/avatars'
            });

            // Update user's avatar URL
            user.avatarUrl = uploadResult.url;
            await user.save();

            return user.avatarUrl;
        } catch (error) {
            if (error.message === 'User not found') {
                throw error;
            }
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }

    async updateInterests(id: string, interests: UserInterest[]) {
        const user = await this.userModel.findOne({ id: id });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.interests = [...user.interests, ...interests.map(interest => ({
            ...interest,
            addedAt: interest.addedAt || new Date()
        }))];
        await user.save();
        return user.interests;
    }
    async deleteInterests(id: string, interestsData: string[]) {
        const user = await this.userModel.findOne({ id: id });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.interests = user.interests.filter(interest => !interestsData.includes(interest.interestId));
        await user.save();
        return user.interests;
    }
}
