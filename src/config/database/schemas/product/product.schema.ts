import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Product {
  @Prop({ default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: Number })
  purchaseValue: number;

  @Prop({ required: true, type: Number })
  saleValue: number;

  @Prop({ required: true, type: Date })
  purchaseDate: Date;

  @Prop({ required: false })
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
