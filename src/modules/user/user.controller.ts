import { Controller, Post, Body, HttpStatus, HttpException, Put, UseGuards, Delete, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiResponse, ResponseUtil, FileValidationPipe } from 'src/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserInterest } from 'src/interfaces/user.interface';
import { UpdateUserDto } from './dtos/updateInfor-user.dto';

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
  // Update user information
  @Put('update')
  async updateUser(@Body() updateUserDto: { data: UpdateUserDto, id: string }): Promise<ApiResponse> {
    return this.userService.updateUser(updateUserDto.id, updateUserDto.data);
  }
  // Update user avatar
  @Put('update-avatar/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File
  ): Promise<ApiResponse> {
    try {
      const result = await this.userService.updateAvatar(id, image);
      return ResponseUtil.success({ avatarUrl: result }, 'Avatar updated successfully', HttpStatus.OK);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to update avatar',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // Update user interests
  @Put('update-interests/:id')
  @UseGuards(JwtAuthGuard)
  async updateInterests(@Param('id') id: string, @Body() body: { interests: UserInterest[] }): Promise<ApiResponse> {
    const interestsData = body.interests.map(interest => ({
      ...interest,
      addedAt: new Date()
    }));
    const result = await this.userService.updateInterests(id, interestsData);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return ResponseUtil.success(result, 'Interests updated successfully', HttpStatus.OK);
  }
  // Delete user interests
  @Delete('delete-interests')
  @UseGuards(JwtAuthGuard)
  async deleteInterests(@Body() deleteInterestsData: { id: string, interests: string[] }): Promise<ApiResponse> {
    const { id, interests } = deleteInterestsData;
    const result = await this.userService.deleteInterests(id, interests);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return ResponseUtil.success(result, 'Interests deleted successfully', HttpStatus.OK);
  }
}
