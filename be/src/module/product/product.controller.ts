import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductService } from './product.service';
import { Response } from 'express';

@Controller('wix')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() productData: Prisma.ProductsCreateInput) {
    return this.productService.createProduct(productData);
  }

  @Get()
  async findAll() {
    return this.productService.products({});
  }

  @Get(':id')
  async findOne(@Param('id') id: Prisma.ProductsWhereUniqueInput) {
    return this.productService.product({ id: +id });
  }

  @Patch(':id')
  async update(@Param('id') id: Prisma.ProductsWhereUniqueInput, @Body() productData: Prisma.ProductsUpdateInput) {
    return this.productService.updateProduct({ where: id, data: productData });
  }

  @Delete(':id')
  async remove(@Param('id') id: Prisma.ProductsWhereUniqueInput, @Res() res: Response) {
    await this.productService.deleteProduct(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
