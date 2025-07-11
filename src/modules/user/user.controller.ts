import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    data: UserResponseDto;
  }> {
    try {
      const user = await this.userService.createUser(createUserDto);

      // Cast to any to access timestamps
      const userDoc = user as any;

      // Create response without password
      const userResponse: UserResponseDto = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        dob: user.dob,
        gender: user.gender,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        interests: user.interests,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt
      };

      return {
        message: 'User created successfully',
        data: userResponse
      };
    } catch (error) {
      if (error.name === 'ConflictException') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
