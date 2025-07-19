import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

@Injectable()
export class CorsConfigService {
    constructor(private configService: ConfigService) { }

    createCorsOptions(): CorsOptions {
        const isDevelopment = this.configService.get('NODE_ENV') !== 'production';

        return {
            origin: isDevelopment ? true : [
                'http://localhost:3000',
                'http://localhost:8080',
                'http://127.0.0.1:5500', // Live Server
                'http://localhost:5500', // Live Server
                // Add your production domains here
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'Accept',
                'X-Requested-With',
                'Origin',
            ],
            credentials: true,
            optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
        };
    }
}
