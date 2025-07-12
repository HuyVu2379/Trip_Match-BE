import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/User';
import * as bcrypt from 'bcrypt';
import { ResponseUtil } from 'src/common';
import { ApiResponse } from 'src/common';
import { DuplicateResourceException } from 'src/common';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Users.name) private userModel: Model<UsersDocument>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { error: 'email', message: 'Email does not exist' };
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return { error: 'password', message: 'Password is incorrect' };
        }

        const { password: _, ...result } = user.toObject();
        return result;
    }

    async login(user: any): Promise<ApiResponse> {
        const payload = { email: user.email, sub: user.id };
        try {
            const loginData = {
                access_token: this.jwtService.sign(payload),
                refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
            };
            return ResponseUtil.success(loginData, 'Login successful', 200);
        } catch (error) {
            return ResponseUtil.error('Login failed', 500);
        }
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
