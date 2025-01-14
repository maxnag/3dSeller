import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Prisma, Products } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { WixProductEvent } from '../wix/events/wix-product.event';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async product(productWhereUniqueInput: Prisma.ProductsWhereUniqueInput): Promise<Products | null> {
    return this.prisma.products.findUnique({
      where: productWhereUniqueInput
    });
  }

  async products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductsWhereUniqueInput;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
  }): Promise<Products[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.products.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createProduct(data: Prisma.ProductsCreateInput, event = true): Promise<Products> {
    try {
      return await this.prisma.products
        .create({
          data
        })
        .then(product => {
          if (event) {
            this.eventEmitter.emit('create-product', new WixProductEvent({ data: product }));
          }

          return product;
        });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('The product you are trying to create exist.', { cause: error });
        }
      }
    }
  }

  async updateProduct(
    params: { where: Prisma.ProductsWhereUniqueInput; data: Prisma.ProductsUpdateInput },
    event = true
  ): Promise<Products> {
    const { where, data } = params;

    return this.prisma.products
      .update({
        data,
        where: { id: +(where.id || where) }
      })
      .then(product => {
        if (event && product.wix_id) {
          this.eventEmitter.emit('update-product', new WixProductEvent({ wix_id: product.wix_id, data: product }));
        }

        return product;
      });
  }

  async deleteProduct(where: Prisma.ProductsWhereUniqueInput): Promise<Products> {
    try {
      return await this.prisma.products
        .delete({
          where: { id: +where }
        })
        .then(product => {
          if (product.wix_id) {
            this.eventEmitter.emit('delete-product', new WixProductEvent({ wix_id: product.wix_id }));
          }

          return product;
        });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('The product you are trying to delete does not exist.', { cause: error });
        }
      }
    }
  }
}
