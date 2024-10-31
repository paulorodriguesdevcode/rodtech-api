import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Customer } from '../customer/customer.schema';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../product';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Order {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  totalValue: number;

  @Prop({ type: Object, required: true })
  customer: Customer;

  @Prop({ type: String })
  customerId: string;

  @Prop({ type: Object, required: true })
  product: Product;

  @Prop({ type: String })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  interest: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
