import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { Destinations, DestinationsSchema } from 'src/schemas/Destination';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Destinations.name, schema: DestinationsSchema }
    ])
  ],
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationService]
})
export class DestinationModule { }
