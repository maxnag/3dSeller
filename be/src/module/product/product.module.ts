import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  exports: [ProductService],
  providers: [ProductService, PrismaService]
})
export class ProductModule {}
