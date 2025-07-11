import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/User';
import * as bcrypt from 'bcrypt';
import { ResponseUtil } from 'src/common';
import { ApiResponse } from 'src/common';
import { DuplicateResourceException } from 'src/common';
import { log } from 'console';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Users.name) private userModel: Model<UsersDocument>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any): Promise<ApiResponse> {
        const payload = { email: user.email, sub: user.id };
        log("check payload:", payload)
        const loginData = {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };

        return ResponseUtil.success(loginData, 'Login successful', 200);
    }

    async register(userData: any): Promise<ApiResponse> {
        const existingUser = await this.userModel.findOne({ email: userData.email });
        if (existingUser) {
            throw new DuplicateResourceException('User', 'Email already exists in the system');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new this.userModel({
            ...userData,
            password: hashedPassword,
        });

        await user.save();
        const { password, ...result } = user.toObject();

        return ResponseUtil.success(result, 'User registered successfully', 201);
    }
}
