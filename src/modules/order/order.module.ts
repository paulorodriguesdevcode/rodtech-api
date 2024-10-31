import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import {
  Order,
  OrderSchema,
} from '../../config/database/schemas/order/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRepository } from './repositories/order.repository';
import {
  Customer,
  CustomerSchema,
} from '../../config/database/schemas/customer';
import { Product, ProductSchema } from 'src/config/database/schemas/product';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
