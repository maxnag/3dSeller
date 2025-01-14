import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ProductService } from '../product/product.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WixProductListener } from './listeners/wix-product.listener';
import { WixService } from './wix.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [WixService],
  providers: [WixService, PrismaService, WixProductListener, ProductService]
})
export class WixModule {}
