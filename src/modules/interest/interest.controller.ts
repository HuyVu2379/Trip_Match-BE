import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dtos/create-interest.dto';
import { ResponseUtil } from 'src/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('interests')
@UseGuards(JwtAuthGuard)
export class InterestController {
  constructor(private readonly interestService: InterestService) { }
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createInterest(@Body() interestData: CreateInterestDto): Promise<ResponseUtil> {
    return this.interestService.createInterest(interestData);
  }
  @UseGuards(JwtAuthGuard)
  @Post('bulk-create')
  async createInterests(@Body() interestsData: CreateInterestDto[]): Promise<ResponseUtil> {
    return this.interestService.bulkCreateInterest(interestsData);
  }
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllInterests(@Query('limit') limit: number): Promise<ResponseUtil> {
    return this.interestService.getAllInterests(limit);
  }
}
