import { Controller, Post, Body, HttpStatus, HttpException, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ApiResponse, ResponseUtil } from 'src/common';
import { JwtAuthGuard } from '../auth';
import { UserInterest } from 'src/interfaces/user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return user;
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
  @Put('update')
  async updateUser(@Body() updateUserDto: { data: CreateUserDto, id: string }): Promise<ApiResponse> {
    return this.userService.updateUser(updateUserDto.id, updateUserDto.data);
  }
  @Put('update-avatar')
  async updateAvatar(@Body() updateAvatarData: { id: string, avatarUrl: string }): Promise<ApiResponse> {
    const { id, avatarUrl } = updateAvatarData;
    const result = await this.userService.updateAvatar(id, avatarUrl);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return ResponseUtil.success(result, 'Avatar updated successfully', HttpStatus.OK);
  }
  @Put('update-interests')
  async updateInterests(@Body() updateInterestsData: { id: string, interests: UserInterest[] }): Promise<ApiResponse> {
    const { id, interests } = updateInterestsData;
    const result = await this.userService.updateInterests(id, interests);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return ResponseUtil.success(result, 'Interests updated successfully', HttpStatus.OK);
  }
}
