import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dtos/create-interest.dto';
import { ResponseUtil } from 'src/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('interests')
@UseGuards(JwtAuthGuard)
export class InterestController {
  constructor(private readonly interestService: InterestService) { }
  @Post('create')
  async createInterest(@Body() interestData: CreateInterestDto): Promise<ResponseUtil> {
    return this.interestService.createInterest(interestData);
  }
  @Post('bulk-create')
  async createInterests(@Body() interestsData: CreateInterestDto[]): Promise<ResponseUtil> {
    return this.interestService.bulkCreateInterest(interestsData);
  }
}
