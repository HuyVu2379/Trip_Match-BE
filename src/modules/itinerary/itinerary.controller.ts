import { Body, Controller, Post } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ResponseUtil } from 'src/common';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) { }

  @Post("import")
  async importJsonItinerary(@Body() filePath: string): Promise<ResponseUtil> {
    return this.itineraryService.importJsonItineraries(filePath);
  }
}
