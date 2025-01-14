import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductService } from '../product/product.service';
import { firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WixService {
  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService
  ) {}

  async createProduct(data: Prisma.ProductsUncheckedCreateInput): Promise<void> {
    try {
      const productData = {
        product: {
          name: data.title,
          productType: 'physical',
          sku: data.sku,
          priceData: {
            price: data.price.toString()
          },
          visible: true
        }
      };

      // create WIX product
      const response = await firstValueFrom(this.httpService.post('/v1/products', productData));

      // update internal product
      await this.productService.updateProduct({ where: { id: data.id }, data: { wix_id: response.data.product.id } }, false);

      // create inventory
      await this.updateInventoryForProduct(data, response.data.product.id);

      // create media
      await this.createMediaForProduct(data, response.data.product.id);
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to create data', error.response?.status || 500);
    }
  }

  async updateProduct(wixProductId: string, data: Prisma.ProductsUpdateInput): Promise<void> {
    try {
      const productData = {
        product: {
          name: data.title,
          productType: 'physical',
          sku: data.sku,
          priceData: {
            price: data.price.toString()
          },
          visible: true
        }
      };

      // update WIX product
      await firstValueFrom(this.httpService.patch(`/v1/products/${wixProductId}`, productData));

      // create inventory
      await this.updateInventoryForProduct(data, wixProductId);

      // create media
      await this.updateMediaForProduct(data, wixProductId);
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to update data', error.response?.status || 500);
    }
  }

  async deleteProduct(wixProductId: string): Promise<void> {
    try {
      await firstValueFrom(this.httpService.delete(`/v1/products/${wixProductId}`));
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to delete data', error.response?.status || 500);
    }
  }

  private async updateInventoryForProduct(data: any, wixProductId: string): Promise<void> {
    try {
      if (data.inventory) {
        // create inventory
        await firstValueFrom(
          this.httpService.patch(`/v2/inventoryItems/product/${wixProductId}`, {
            inventoryItem: {
              trackQuantity: true,
              variants: [
                {
                  variantId: '00000000-0000-0000-0000-000000000000',
                  inStock: true,
                  quantity: +data.inventory
                }
              ]
            }
          })
        );
      }
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to create inventory data', error.response?.status || 500);
    }
  }

  private async createMediaForProduct(data: any, wixProductId: string): Promise<void> {
    try {
      if (data.picture) {
        // create media
        await firstValueFrom(
          this.httpService.post(`/v1/products/${wixProductId}/media`, {
            media: [
              {
                url: data.picture
              }
            ]
          })
        );
      }
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to create media data', error.response?.status || 500);
    }
  }

  private async updateMediaForProduct(data: any, wixProductId: string): Promise<void> {
    try {
      if (data.picture) {
        // delete media
        await firstValueFrom(this.httpService.post(`/v1/products/${wixProductId}/media/delete`));
        // create media
        await this.createMediaForProduct(data, wixProductId);
      }
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to create media data', error.response?.status || 500);
    }
  }

  @Cron('0 30 * * * *')
  private async products(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`/v1/products/query`, {
          query: {
            paging: {
              limit: '50'
            }
          }
        })
      );

      await this.syncProduct(response.data);
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to fetch data', error.response?.status || 500);
    }
  }

  private async syncProduct(wixProducts): Promise<void> {
    try {
      for (const wixProduct of wixProducts.products) {
        const product = await this.productService.product({ wix_id: wixProduct.id });
        const syncProduct = {
          wix_id: wixProduct.id,
          sku: wixProduct.sku || null,
          title: wixProduct.name,
          price: wixProduct?.priceData?.price || 0,
          inventory: wixProduct?.stock?.quantity || 0,
          picture: wixProduct?.media?.mainMedia?.image?.url || null
        };

        if (product === null) {
          await this.productService.createProduct(syncProduct, false);
        } else {
          await this.productService.updateProduct({ where: { id: product.id }, data: syncProduct }, false);
        }
      }
    } catch (error) {
      // @ts-ignore
      console.log(error.response?.data || 'Failed to sync data', error.response?.status || 500);
    }
  }
}
