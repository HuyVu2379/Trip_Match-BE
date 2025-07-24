import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth';
import { ExamplesModule } from './examples/examples.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { InterestModule } from './modules/interest/interest.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CorsConfigService } from './common/services/cors-config.service';
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { DestinationModule } from './modules/destination/destination.module';
import { ItineraryModule } from './modules/itinerary/itinerary.module';
import { ItineraryDayModule } from './modules/itinerary-day/itinerary-day.module';
import { ReviewModule } from './modules/review/review.module';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGODB_URI'),
      }),
    }),
    AuthModule,
    InterestModule,
    ExamplesModule,
    CloudinaryModule,
    DestinationModule,
    ItineraryModule,
    ItineraryDayModule,
    ReviewModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CorsConfigService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}