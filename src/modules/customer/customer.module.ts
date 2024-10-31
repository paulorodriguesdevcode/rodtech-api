import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import {
  Customer,
  CustomerSchema,
} from '../../config/database/schemas/customer/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerRepository } from './repositories/customer.repository';
import { Order, OrderSchema } from 'src/config/database/schemas/order';
import { OrderService } from '../order/services/order.service';
import { OrderRepository } from '../order/repositories/order.repository';
import { ProductService } from '../product/services/product.service';
import { ProductRepository } from '../product/repositories/product.repository';
import { Product, ProductSchema } from 'src/config/database/schemas/product';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    OrderService,
    OrderRepository,
    ProductService,
    ProductRepository,
  ],
})
export class CustomerModule {}
