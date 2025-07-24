import { Body, Controller, Post } from '@nestjs/common';
import { ItineraryDayService } from './itinerary-day.service';
import { ResponseUtil } from 'src/common';

@Controller('itinerary-day')
export class ItineraryDayController {
  constructor(private readonly itineraryDayService: ItineraryDayService) { }
  @Post("import")
  async importJsonItineraryDays(@Body() filePath: string): Promise<ResponseUtil> {
    return this.itineraryDayService.importJsonItineraries(filePath);
  }
}