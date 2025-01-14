import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WixProductEvent } from '../events/wix-product.event';
import { WixService } from '../wix.service';

@Injectable()
export class WixProductListener implements OnModuleInit {
  constructor(
    private eventEmitter: EventEmitter2,
    private wixService: WixService
  ) {}

  onModuleInit(): void {
    this.eventEmitter.on('create-product', async (event: WixProductEvent) => {
      await this.wixService.createProduct(event.data);
    });

    this.eventEmitter.on('update-product', async (event: WixProductEvent) => {
      await this.wixService.updateProduct(event.wixProductId, event.data);
    });

    this.eventEmitter.on('delete-product', async (event: WixProductEvent) => {
      await this.wixService.deleteProduct(event.wixProductId);
    });
  }
}
