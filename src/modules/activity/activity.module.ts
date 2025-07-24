import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activities, ActivitiesSchema } from 'src/schemas/Activity';

import { AuthModule } from '../auth';
import { DestinationModule } from '../destination/destination.module';
import { Destinations, DestinationsSchema } from 'src/schemas/Destination';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
      { name: Destinations.name, schema: DestinationsSchema }
    ]),
    AuthModule,
    DestinationModule
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule { }
