import { Module } from '@nestjs/common';
import { ItineraryDayService } from './itinerary-day.service';
import { ItineraryDayController } from './itinerary-day.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItineraryDays, ItineraryDaysSchema } from 'src/schemas/ItineraryDay';
import { AuthModule } from '../auth';
import { ActivityModule } from '../activity/activity.module';
import { Activities, ActivitiesSchema } from 'src/schemas/Activity';
import { Itineraries, ItinerariesSchema } from 'src/schemas/Itinerary';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItineraryDays.name, schema: ItineraryDaysSchema },
      { name: Activities.name, schema: ActivitiesSchema },
      { name: Itineraries.name, schema: ItinerariesSchema }
    ]),
    AuthModule,
    ActivityModule
  ],
  controllers: [ItineraryDayController],
  providers: [ItineraryDayService],
})
export class ItineraryDayModule { }
