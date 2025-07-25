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
        const payload = { email: user.email, sub: user.id, roles: user.role };
        try {
            const loginData = {
                access_token: this.jwtService.sign(payload),
                refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    roles: user.role
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
        user.avatarUrl = 'https://res.cloudinary.com/dxssmpeii/image/upload/v1752400699/225-default-avatar_dzvf4c.png'
        await user.save();
        const { password, ...result } = user.toObject();

        return ResponseUtil.success(result, 'User registered successfully', 201);
    }
    async getMe(token: any): Promise<ApiResponse> {
        try {
            const access_token = token.token;
            const decoded = this.jwtService.verify(access_token);
            const user = await this.userModel.findOne({ id: decoded.sub }).select('-password');
            if (!user) {
                return ResponseUtil.error('User not found', 404);
            }
            return ResponseUtil.success(user, 'User retrieved successfully', 200);
        } catch (error) {
            return ResponseUtil.error('Invalid token', 401);
        }
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse> {
        try {
            // Verify refresh token
            const decoded = this.jwtService.verify(refreshToken);

            // Find user by ID from token
            const user = await this.userModel.findById(decoded.sub).select('-password');
            if (!user) {
                return ResponseUtil.error('User not found', 404);
            }

            // Generate new access token and refresh token
            const payload = { email: user.email, sub: user._id, roles: user.role };
            const newTokens = {
                access_token: this.jwtService.sign(payload),
                refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    roles: user.role
                },
            };

            return ResponseUtil.success(newTokens, 'Token refreshed successfully', 200);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return ResponseUtil.error('Refresh token expired', 401);
            } else if (error.name === 'JsonWebTokenError') {
                return ResponseUtil.error('Invalid refresh token', 401);
            }
            return ResponseUtil.error('Token refresh failed', 500);
        }
    }
}
