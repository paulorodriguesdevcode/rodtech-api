export class CreateProductDto {
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly quantity: number;
  readonly purchaseValue: number;
  readonly saleValue: number;
  readonly purchaseDate: Date;
  readonly imageUrl?: string;
}

export class UpdateProductDto {
  readonly name?: string;
  readonly description?: string;
  readonly type: string;
  readonly quantity?: number;
  readonly purchaseValue?: number;
  readonly saleValue?: number;
  readonly purchaseDate?: Date;
  readonly imageUrl?: string;
}
