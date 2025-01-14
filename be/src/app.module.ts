import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from './exceptions/api-exception.filter';
import { AxiosRequestConfig } from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { WixModule } from './module/wix/wix.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: process.env.NODE_ENV === 'production',
      envFilePath: [`${__dirname}/../` + (process.env.NODE_ENV === undefined ? `.env` : `.env.${process.env.NODE_ENV}`)],
      isGlobal: true
    }),
    EventEmitterModule.forRoot({
      delimiter: '-',
      verboseMemoryLeak: process.env.NODE_ENV !== 'production'
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<AxiosRequestConfig> => ({
        timeout: 5000,
        baseURL: configService.get<string>('WIX_API_URL'),
        headers: {
          Authorization: configService.get<string>('WIX_API_KEY'),
          'wix-site-id': configService.get<string>('WIX_SITE_ID'),
          'Content-Type': 'application/json'
        }
      }),
      inject: [ConfigService],
      global: true
    }),
    ProductModule,
    WixModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter
    }
  ]
})
export class AppModule {}
