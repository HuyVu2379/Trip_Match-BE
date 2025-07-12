import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { Interests, InterestsSchema } from 'src/schemas/Interest';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Interests.name, schema: InterestsSchema }]),
    AuthModule
  ],
  controllers: [InterestController],
  providers: [InterestService],
  exports: [InterestService],
})
export class InterestModule { }
