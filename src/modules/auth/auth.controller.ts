import { Controller, Post, Body, UseGuards, Request, Get, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ResponseUtil } from 'src/common';
import { ApiResponse } from 'src/common';
import { LoginDto } from './dtos/login.dto';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @UseFilters(AuthExceptionFilter)
  @Post('login')
  async login(@Request() req): Promise<ApiResponse> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userData: RegisterDto): Promise<ApiResponse> {
    return this.authService.register(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: any): ApiResponse {
    return ResponseUtil.success(user, 'Profile retrieved successfully', 200);
  }
  @UseGuards(JwtAuthGuard)
  @Post('getMe')
  async getMe(@Body() token: any): Promise<ApiResponse> {
    return this.authService.getMe(token);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponse> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }
}
