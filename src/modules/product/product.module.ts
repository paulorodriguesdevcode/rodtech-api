import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import {
  Order,
  OrderSchema,
} from '../../config/database/schemas/order/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRepository } from './repositories/product.repository';
import {
  Customer,
  CustomerSchema,
} from '../../config/database/schemas/customer';
import { ProductController } from './controllers/product.controller';
import { Product, ProductSchema } from 'src/config/database/schemas/product';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductsModule {}
