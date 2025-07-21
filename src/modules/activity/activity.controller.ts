import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ResponseUtil } from 'src/common';
import { ImportActivityDto } from './dtos/import-activity-dto';
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post("import")
  async importFromJSON(@Body() importDto: ImportActivityDto): Promise<ResponseUtil> {
    const filePath = importDto.filePath;
    return this.activityService.importActivitiesFromJSON(filePath);
  }

  @Get("getAll")
  async getAllActivities(): Promise<ResponseUtil> {
    return this.activityService.getAllActivities();
  }
  @Get(":id")
  async getActivityById(@Param("id") id: string): Promise<ResponseUtil> {
    return this.activityService.getActivityById(id);
  }
  @Get("related/:destinationId")
  async getActivityRelatedToDestination(@Param("destinationId") destinationId: string, @Query("limit") limit: number): Promise<ResponseUtil> {
    return this.activityService.getActivityRelatedToDestination(destinationId, limit);
  }
  @Get("relatedWithPage/:destinationId")
  async getActivityRelatedWithPage(@Param("destinationId") destinationId: string, @Query("limit") limit: number, @Query("page") page: number): Promise<ResponseUtil> {
    return this.activityService.getActivityRelatedWithPage(destinationId, limit, page);
  }
  @Get("highlightedSightseeing")
  async getActivityHighlightedSightSeeingWithPage(@Query("limit") limit: number, @Query("page") page: number): Promise<ResponseUtil> {
    return this.activityService.getActivityHighlightedSightSeeingWithPage(limit, page);
  }
}
