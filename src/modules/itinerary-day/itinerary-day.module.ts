import { Module } from '@nestjs/common';
import { ItineraryDayService } from './itinerary-day.service';
import { ItineraryDayController } from './itinerary-day.controller';

@Module({
  controllers: [ItineraryDayController],
  providers: [ItineraryDayService],
})
export class ItineraryDayModule {}
