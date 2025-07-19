import { Controller, Post, Get, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { ImportDestinationDto } from './dtos';
import { ResponseUtil } from 'src/common';

@Controller('destinations')
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) { }

  /**
   * Import destinations từ file JSON
   * POST /destinations/import
   */
  @Post('import')
  async importFromJSON(@Body() importDto: ImportDestinationDto) {
    try {
      const result = await this.destinationService.importDestinationsFromJSON(importDto.filePath);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi import destinations',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Lấy tất cả destinations
   * GET /destinations
   */
  @Get()
  async findAll() {
    try {
      const destinations = await this.destinationService.findAll();
      return ResponseUtil.success(destinations, 'Lấy danh sách destinations thành công', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi lấy destinations',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("findWithPage")
  async findWithPage(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    try {
      const destinations = await this.destinationService.findWithPage(page, limit);
      return ResponseUtil.success(destinations, 'Lấy danh sách destinations theo trang thành công', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi lấy destinations theo trang',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Lấy destination theo ID
   * GET /destinations/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const destination = await this.destinationService.findById(id);
      if (!destination) {
        throw new HttpException('Không tìm thấy destination', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Lấy destination thành công',
        data: destination
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi lấy destination',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Đếm số lượng destinations
   * GET /destinations/count
   */
  @Get('meta/count')
  async count() {
    try {
      const count = await this.destinationService.count();
      return {
        statusCode: HttpStatus.OK,
        message: 'Đếm destinations thành công',
        data: { count }
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi đếm destinations',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Xóa tất cả destinations (chỉ dùng cho testing)
   * DELETE /destinations/all
   */
  @Delete('all')
  async deleteAll() {
    try {
      const result = await this.destinationService.deleteAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Xóa tất cả destinations thành công',
        data: result
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi xóa destinations',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
