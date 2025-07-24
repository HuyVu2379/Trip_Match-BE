
import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Itineraries, ItinerariesSchema } from 'src/schemas/Itinerary';
import { AuthModule } from '../auth';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Itineraries.name, schema: ItinerariesSchema }]),
    AuthModule,
    ActivityModule
  ],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule { }
