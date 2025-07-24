import { Controller, Post, Body, UploadedFiles, UseInterceptors, HttpStatus, Delete, Param, Query, Get, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateReviews } from './dtos/create-review-dto';
import { ReviewService } from './review.service';
import { ResponseUtil } from 'src/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post('create')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('photos'))
  async createReview(
    @Body() data: CreateReviews,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<ResponseUtil> {
    const result = await this.reviewService.createReview(data, files);
    return ResponseUtil.success(result, 'Create review successfully', HttpStatus.CREATED);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param('id') id: string): Promise<ResponseUtil> {
    const result = await this.reviewService.deleteReview(id);
    return ResponseUtil.success(result, 'Delete review successfully', HttpStatus.OK);
  }

  @Get("getReview")
  async getReviewByTargetIdWithPage(
    @Query('targetId') targetId: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<ResponseUtil> {
    const result = await this.reviewService.getReviewByTargetIdWithPage(targetId, page, limit);
    return ResponseUtil.success(result, 'Get reviews successfully', HttpStatus.OK);
  }

  @Get('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateReview(@Param('id') id: string, @Body() data: CreateReviews): Promise<ResponseUtil> {
    const result = await this.reviewService.updateReview(id, data);
    return ResponseUtil.success(result, 'Update review successfully', HttpStatus.OK);
  }
}
