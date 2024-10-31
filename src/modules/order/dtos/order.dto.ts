import { Customer } from 'src/config/database/schemas/customer';
import { Product } from 'src/config/database/schemas/product';

export class CreateOrderDto {
  readonly product: Product;
  readonly customer: Customer;
  readonly quantity: number;
}

export class UpdateOrderDto {
  readonly product: Product;
  readonly customer: Customer;
  readonly quantity: number;
}
