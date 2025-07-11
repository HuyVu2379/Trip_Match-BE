import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
}
