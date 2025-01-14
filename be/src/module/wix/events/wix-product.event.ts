import { Prisma } from '@prisma/client';

export class WixProductEvent {
  readonly wixProductId: string;
  readonly data: Prisma.ProductsUncheckedCreateInput;

  constructor(data: object) {
    this.wixProductId = data['wix_id'];
    this.data = data['data'];
  }
}
